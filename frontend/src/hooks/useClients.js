import { useState, useEffect, useMemo } from 'react';
import { clientService } from '../services/clientService';

// Función auxiliar para obtener el arreglo de clientes
const normalizeClientsResponse = (responseData) => {
    if (Array.isArray(responseData)) return responseData;
    if (Array.isArray(responseData?.data)) return responseData.data;
    if (Array.isArray(responseData?.clients)) return responseData.clients;
    if (Array.isArray(responseData?.rows)) return responseData.rows;
    return [];
};

// Función auxiliar para obtener el total de registros que viene del backend
const extractTotal = (responseData) => {
    // 1. Añadimos la lectura del objeto 'pagination' que envía tu backend actual
    if (typeof responseData?.pagination?.total === 'number') return responseData.pagination.total;

    // 2. Mantenemos las demás por si cambia la estructura o para los mocks
    if (typeof responseData?.total === 'number') return responseData.total;
    if (typeof responseData?.count === 'number') return responseData.count;
    if (typeof responseData?.meta?.total === 'number') return responseData.meta.total;

    // Fallback: Si el backend no manda 'total', al menos usamos la longitud del arreglo
    return normalizeClientsResponse(responseData).length;
};

// 1. Recibir configuración inicial de paginación
export const useClients = ({ page = 1, limit = 10 } = {}) => {
    const [clients, setClients] = useState([]);
    const [total, setTotal] = useState(0); // 2. Estado para el total de registros
    const [searchTerm, setSearchTerm] = useState('');
    const [isMockData, setIsMockData] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchClients = async () => {
        setLoading(true);

        try {
            // 3. Pasamos la página y límite al servicio
            const { data, isMock } = await clientService.getAll({ page, limit });

            setClients(normalizeClientsResponse(data));
            setTotal(extractTotal(data)); // 4. Asignar el total
            setIsMockData(isMock);
        } catch (error) {
            console.error("Error al cargar clientes:", error);
        } finally {
            setLoading(false);
        }
    };

    // 5. El efecto se ejecuta cuando cambia la página o el límite
    useEffect(() => {
        fetchClients();
    }, [page, limit]);

    // OJO: Esta búsqueda en frontend solo filtrará los registros de la página ACTUAL.
    // Lo ideal en el futuro es que el backend también reciba el searchTerm.
    const filteredClients = useMemo(() => {
        if (!searchTerm) return clients;

        const lowerSearch = searchTerm.toLowerCase();

        return clients.filter(client =>
            client.nombres?.toLowerCase().includes(lowerSearch) ||
            client.email?.toLowerCase().includes(lowerSearch) ||
            client.telefono?.includes(lowerSearch)
        );
    }, [clients, searchTerm]);

    const addClient = async (data) => {
        await clientService.create(data);
        await fetchClients();
    };

    const updateClient = async (id, data) => {
        await clientService.update(id, data);
        await fetchClients();
    };

    const deleteClient = async (id) => {
        await clientService.delete(id);
        await fetchClients();
    };

    return {
        clients: filteredClients,
        total, // 6. Devolvemos el total para que App.js lo use en la paginación
        searchTerm,
        setSearchTerm,
        isMockData,
        loading,
        addClient,
        updateClient,
        deleteClient
    };
};