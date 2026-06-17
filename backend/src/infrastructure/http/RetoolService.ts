import axios from 'axios';
import http from 'http';
import https from 'https';
import CircuitBreaker from 'opossum';

import {
    RetoolCreateClientPayload,
    RetoolUpdateClientPayload
} from "../../application/use-cases/client/shared/RetoolClient";

const httpAgent = new http.Agent({ keepAlive: true, maxSockets: 100 });
const httpsAgent = new https.Agent({ keepAlive: true, maxSockets: 100 });

const RETOOL_API_URL = process.env.RETOOL_API_URL;

if (!RETOOL_API_URL) {
    throw new Error('RETOOL_API_URL no está configurada en variables de entorno');
}

const retoolClient = axios.create({
    baseURL: RETOOL_API_URL,
    httpAgent,
    httpsAgent,
    timeout: Number(process.env.RETOOL_TIMEOUT_MS || 5000)
});

const breakerOptions = {
    timeout: 4000,
    errorThresholdPercentage: 50,
    resetTimeout: 10000
};

const retry = async <T>(
    actionName: string,
    action: () => Promise<T>,
    maxRetries: number = 3
): Promise<T> => {
    let lastError: unknown;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`[RetoolService] ${actionName} intento ${attempt}/${maxRetries}`);

            const result = await action();

            console.log(`[RetoolService] ${actionName} exitoso en intento ${attempt}/${maxRetries}`);

            return result;
        } catch (error) {
            lastError = error;

            const errorMessage = error instanceof Error
                ? error.message
                : 'Error desconocido';

            console.warn(`[RetoolService] ${actionName} falló en intento ${attempt}/${maxRetries}: ${errorMessage}`);
        }
    }

    throw lastError;
};

const createClientInRetool = async (clientData: RetoolCreateClientPayload) => {
    return await retry('createClient', async () => {
        const response = await retoolClient.post('', clientData);
        return response.data;
    }, 3);
};

const updateClientInRetool = async (retoolId: number, clientData: RetoolUpdateClientPayload) => {
    return await retry(`updateClient:${retoolId}`, async () => {
        const response = await retoolClient.put(`/${retoolId}`, clientData);
        return response.data;
    }, 3);
};

const deleteClientInRetool = async (retoolId: number) => {
    return await retry(`deleteClient:${retoolId}`, async () => {
        const response = await retoolClient.delete(`/${retoolId}`);
        return response.data;
    }, 3);
};

const createClientBreaker = new CircuitBreaker<[RetoolCreateClientPayload], any>(
    createClientInRetool,
    breakerOptions
);

const updateClientBreaker = new CircuitBreaker<[number, RetoolUpdateClientPayload], any>(
    updateClientInRetool,
    breakerOptions
);


const deleteClientBreaker = new CircuitBreaker<[number], any>(
    deleteClientInRetool,
    breakerOptions
);

export const RetoolService = {
    createClient: async (client: RetoolCreateClientPayload) => {
        return await createClientBreaker.fire(client);
    },

    updateClient: async (retoolId: number, client: RetoolUpdateClientPayload) => {
        return await updateClientBreaker.fire(retoolId, client);
    },

    deleteClient: async (retoolId: number) => {
        return await deleteClientBreaker.fire(retoolId);
    }
};