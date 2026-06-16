import { useState, useEffect, useMemo } from 'react';
import { clientService } from '../services/clientService';

export const useClients = () => {
    const [clients, setClients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isMockData, setIsMockData] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchClients = async () => {
        setLoading(true);
        const { data, isMock } = await clientService.getAll();
        setClients(data);
        setIsMockData(isMock);
        setLoading(false);
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const filteredClients = useMemo(() => {
        if (!searchTerm) return clients;
        const lowerSearch = searchTerm.toLowerCase();
        return clients.filter(client =>
            client.nombres.toLowerCase().includes(lowerSearch) ||
            client.email.toLowerCase().includes(lowerSearch) ||
            client.telefono.includes(lowerSearch)
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
        searchTerm,
        setSearchTerm,
        isMockData,
        loading,
        addClient,
        updateClient,
        deleteClient
    };
};