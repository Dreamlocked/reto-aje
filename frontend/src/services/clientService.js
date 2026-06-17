import axios from 'axios';
import { clients } from './mocks/clients.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
const API_URL = `${API_BASE_URL}/clients`;

console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('API_URL:', API_URL);

// Variable en memoria para simular el CRUD cuando estamos en modo Mock
let localMockData = [...clients];

// Mapeo de errores de validación del backend
const mapBackendValidationErrors = (errors = []) => {
    return errors.reduce((acc, error) => {
        const messages = error.constraints
            ? Object.values(error.constraints)
            : ['Campo inválido'];

        acc[error.property] = messages[0];
        return acc;
    }, {});
};

// Nueva función para transformar errores de Axios a tu formato custom
const handleAxiosError = (error) => {
    // Si el error tiene 'response', el servidor respondió (ej: 400 Bad Request)
    if (error.response) {
        const data = error.response.data;
        const customError = new Error(data?.title || 'Error en backend');

        customError.status = error.response.status;
        customError.detail = data?.detail;
        customError.validationErrors = mapBackendValidationErrors(data?.errors || []);
        customError.response = data;

        throw customError; // Lo lanzamos para que lo atrape el frontend
    }

    // Si no hay 'response', el servidor está caído (Network Error)
    throw error;
};

export const clientService = {
    getAll: async ({ page = 1, limit = 10 } = {}) => {
        try {
            // Pasamos query params usando el objeto de configuración de Axios
            const response = await axios.get(API_URL, {
                params: { page, limit }
            });

            return {
                data: response.data,
                isMock: false
            };
        } catch (error) {
            console.warn('Backend no disponible. Usando datos Mock.');

            // Simular paginación para la data Mock
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedData = localMockData.slice(startIndex, endIndex);

            return {
                data: {
                    data: paginatedData, // Tu componente extraerá estos
                    total: localMockData.length // Y usará el total para la paginación
                },
                isMock: true
            };
        }
    },

    create: async (clientData) => {
        try {
            const response = await axios.post(API_URL, clientData);
            return response.data; // Retornamos los datos directamente
        } catch (error) {
            try {
                // Procesamos el error del backend
                handleAxiosError(error);
            } catch (handledError) {
                // Si el backend validó algo mal (400), lo devolvemos al componente para mostrarlo
                if (handledError.status === 400) {
                    throw handledError;
                }
            }

            // Si llegamos aquí, es porque el servidor está apagado. Usamos el mock.
            const newClient = {
                ...clientData,
                id: Date.now(),
                fecha_creacion: new Date().toISOString()
            };

            localMockData.push(newClient);
            return newClient;
        }
    },

    update: async (id, clientData) => {
        try {
            // Extraemos SOLO los campos mutables y aseguramos tipos (ej. el estado debe ser int)
            const payload = {
                nombres: clientData.nombres,
                email: clientData.email,
                telefono: clientData.telefono,
                estado: Number(clientData.estado)
            };

            // Cambiamos a patch si lo modificas en tu Controller (o déjalo en put)
            const response = await axios.patch(`${API_URL}/${id}`, payload);
            return response.data;
        } catch (error) {
            try {
                handleAxiosError(error);
            } catch (handledError) {
                if (handledError.status === 400) {
                    throw handledError;
                }
            }

            // Mock: Actualizar en memoria
            localMockData = localMockData.map(c => c.id === id ? { ...c, ...clientData } : c);
            return clientData;
        }
    },

    delete: async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return true;
        } catch (error) {
            // Mock: Eliminar en memoria
            localMockData = localMockData.filter(c => c.id !== id);
            return true;
        }
    }
};