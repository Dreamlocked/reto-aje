import { useState } from 'react';

export const ClientDelete = ({ client, onConfirm, onCancel }) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            // Esperamos a que termine la petición al backend
            await onConfirm();
        } catch (error) {
            console.error("Error al eliminar el cliente:", error);
        } finally {
            // Por si la petición falla y el modal no se cierra, restauramos el botón
            setIsDeleting(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <p className="text-aje-ebony">
                ¿Estás totalmente seguro de eliminar al cliente{' '}
                <strong>{client?.nombres}</strong>?
            </p>

            <div className="flex justify-end gap-3 mt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isDeleting}
                    className="cursor-pointer focus:outline-none focus:ring-0 px-4 py-2 text-gray-500 bg-gray-100 hover:bg-gray-200 hover:text-aje-ebony rounded-md font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    Cancelar
                </button>

                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={isDeleting}
                    className="font-medium cursor-pointer px-4 py-2 focus:outline-none focus:ring-0 p-2 text-aje-red bg-aje-red/10 hover:bg-aje-red hover:text-white rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isDeleting ? 'Eliminando...' : 'Sí, Eliminar'}
                </button>
            </div>
        </div>
    );
};