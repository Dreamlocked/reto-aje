import { clients } from './mocks/clients.js';

const API_URL = 'http://localhost:3000/api/clientes';

// Variable en memoria para simular el CRUD cuando estamos en modo Mock
let localMockData = [...clients];

export const clientService = {
    getAll: async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Error en backend');
            const data = await response.json();
            return { data, isMock: false };
        } catch (error) {
            console.warn("Backend no disponible. Usando datos Mock.");
            return { data: localMockData, isMock: true };
        }
    },

    create: async (clientData) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clientData)
            });
            if (!response.ok) throw new Error('Error en backend');
            return await response.json();
        } catch (error) {
            const newClient = { ...clientData, id: Date.now(), fecha_creacion: new Date().toISOString() };
            localMockData.push(newClient);
            return newClient;
        }
    },

    update: async (id, clientData) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clientData)
            });
            if (!response.ok) throw new Error('Error en backend');
            return await response.json();
        } catch (error) {
            localMockData = localMockData.map(c => c.id === id ? { ...c, ...clientData } : c);
            return clientData;
        }
    },

    delete: async (id) => {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Error en backend');
            return true;
        } catch (error) {
            localMockData = localMockData.filter(c => c.id !== id);
            return true;
        }
    }
};