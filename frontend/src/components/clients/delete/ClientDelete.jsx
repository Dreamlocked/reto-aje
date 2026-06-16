export const ClientDelete = ({ client, onConfirm, onCancel }) => {
    return (
        <div className="flex flex-col gap-4 ">
                <p>
                    ¿Estás totalmente seguro de eliminar al cliente{' '}
                    <strong>{client?.nombres}</strong>?
                </p>
            <div className="flex justify-end gap-3 mt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="cursor-pointer focus:outline-none focus:ring-0 px-4 py-2 text-gray-500 bg-gray-100 hover:bg-gray-200 hover:text-aje-ebony rounded-md font-medium transition-colors"
                >
                    Cancelar
                </button>

                <button
                    type="button"
                    onClick={onConfirm}
                    className="font-medium cursor-pointer px-4 py-2 focus:outline-none focus:ring-0 p-2 text-aje-red bg-aje-red/10 hover:bg-aje-red hover:text-white rounded-md transition-colors"
                >
                    Sí, Eliminar
                </button>
            </div>
        </div>
    );
};