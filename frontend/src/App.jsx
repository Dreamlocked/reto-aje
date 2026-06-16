import {useRef, useState} from 'react';
import {useClients} from './hooks/useClients';
import {Header} from './layout/Header';
import {ConfirmDialog} from './components/shared/ConfirmDialog.jsx';
import {ClientList} from './components/clients/ClientList';
import {ClientCreate} from './components/clients/create/ClientCreate';
import {ClientUpdate} from './components/clients/update/ClientUpdate';
import {ClientDelete} from './components/clients/delete/ClientDelete';

function App() {
    const {clients, searchTerm, setSearchTerm, isMockData, addClient, updateClient, deleteClient} = useClients();

    // 1. Ref para el Modal del Formulario
    const formDialogRef = useRef(null);
    const [formConfig, setFormConfig] = useState({action: null, client: null});

    // 2. Ref para el Modal de Eliminación
    const deleteDialogRef = useRef(null);
    const [clientToDelete, setClientToDelete] = useState(null);

    // --- CONTROL DE FORMULARIO ---
    const openForm = (action, client = null) => {
        setFormConfig({action, client});
        formDialogRef.current?.showModal();
    };

    const closeForm = () => {
        formDialogRef.current?.close();
        setFormConfig({action: null, client: null});
    };

    // --- CONTROL DE ELIMINACIÓN ---
    const openDeleteDialog = (client) => {
        setClientToDelete(client);
        deleteDialogRef.current?.showModal();
    };

    const closeDeleteDialog = () => {
        deleteDialogRef.current?.close();
        setClientToDelete(null);
    };

    const handleFormSubmit = async (data) => {
        if (formConfig.action === 'create') {
            await addClient(data);
        }

        if (formConfig.action === 'update') {
            await updateClient(data.id, data);
        }

        closeForm();
    };

    const handleDeleteConfirm = async () => {
        if (!clientToDelete) return;

        await deleteClient(clientToDelete.id);
        closeDeleteDialog();
    };

    return (<div className="min-h-screen bg-gray-50 font-sans">
        <Header isMockData={isMockData}/>

        <main className="container mx-auto p-4 md:p-6">
            <div
                className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <input
                    type="text" placeholder="🔍 Buscar cliente..." value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-aje-green text-aje-ebony"
                />
                <button
                    onClick={() => openForm('create')}
                    className="cursor-pointer focus:outline-none focus:ring-0 w-full md:w-auto bg-aje-green hover:bg-[#3da342] text-white px-6 py-2 rounded-md font-bold transition-colors"
                >
                    + Nuevo Cliente
                </button>
            </div>

            <ClientList
                clients={clients}
                onEdit={(client) => openForm('update', client)}
                onDelete={(client) => openDeleteDialog(client)}
            />
        </main>

        <ConfirmDialog
            dialogRef={formDialogRef}
            title={formConfig.action === 'create' ? "Registrar Nuevo Cliente" : "Actualizar Cliente"}
            onClose={closeForm}
        >
            {formConfig.action === 'create' && (<ClientCreate
                onSubmit={handleFormSubmit}
                onCancel={closeForm}
            />)}

            {formConfig.action === 'update' && (<ClientUpdate
                client={formConfig.client}
                onSubmit={handleFormSubmit}
                onCancel={closeForm}
            />)}
        </ConfirmDialog>

        <ConfirmDialog
            dialogRef={deleteDialogRef}
            title="Eliminar Cliente"
            onClose={closeDeleteDialog}
        >
            <ClientDelete
                client={clientToDelete}
                onCancel={closeDeleteDialog}
                onConfirm={handleDeleteConfirm}
            />
        </ConfirmDialog>
    </div>);
}

export default App;