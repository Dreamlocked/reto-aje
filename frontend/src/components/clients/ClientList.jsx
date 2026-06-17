import React from 'react';

export const ClientList = ({
                               clients = [],
                               pagination = { page: 1, limit: 10, total: 0 },
                               onPageChange,
                               onEdit,
                               onDelete
                           }) => {
    const clientList = Array.isArray(clients) ? clients : [];

    // Calcular el total de páginas
    const totalPages = Math.ceil(pagination.total / pagination.limit) || 1;

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto min-h-[60vh]">
                <table className="w-full text-left text-sm text-aje-ebony">
                    <thead className="bg-aje-ebony text-white">
                    <tr>
                        <th className="p-4 font-semibold">ID</th>
                        <th className="p-4 font-semibold">Nombres</th>
                        <th className="p-4 font-semibold">Email</th>
                        <th className="p-4 font-semibold">Teléfono</th>
                        <th className="p-4 font-semibold">Estado</th>
                        <th className="p-4 font-semibold text-center">Acciones</th>
                    </tr>
                    </thead>
                    <tbody>
                    {clientList.length === 0 ? (
                        <tr><td colSpan="6" className="p-8 text-center text-gray-500 font-medium">No se encontraron clientes.</td></tr>
                    ) : (
                        clientList.map(client => (
                            <tr key={client.id} className="border-b border-gray-100 hover:bg-aje-green/5 transition-colors">
                                <td className="p-4">{client.id}</td>
                                <td className="p-4 font-bold">{client.nombres}</td>
                                <td className="p-4">{client.email}</td>
                                <td className="p-4">{client.telefono}</td>
                                <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${client.estado === 1 ? 'bg-aje-green/20 text-[#2b7832]' : 'bg-aje-red/20 text-aje-red'}`}>
                                            {client.estado === 1 ? 'Activo' : 'Inactivo'}
                                        </span>
                                </td>
                                <td className="p-4 flex justify-center gap-2">
                                    <button onClick={() => onEdit(client)} title="Editar" className="cursor-pointer focus:outline-none focus:ring-0 p-2 text-aje-orange bg-aje-orange/10 hover:bg-aje-orange hover:text-white rounded-md transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    </button>
                                    <button onClick={() => onDelete(client)} title="Eliminar" className="cursor-pointer focus:outline-none focus:ring-0 p-2 text-aje-red bg-aje-red/10 hover:bg-aje-red hover:text-white rounded-md transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>

            {/* Controles de Paginación */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
                    <div className="flex flex-1 items-center justify-between flex-wrap gap-4">
                        <div>
                            <p className="text-sm text-gray-700">
                                Mostrando página <span className="font-medium">{pagination.page}</span> de <span className="font-medium">{totalPages}</span>
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => onPageChange(pagination.page - 1)}
                                    disabled={pagination.page === 1}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${pagination.page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <span className="sr-only">Anterior</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                </button>

                                {/* Botones de números de página */}
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => onPageChange(i + 1)}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${pagination.page === i + 1 ? 'z-10 bg-aje-ebony text-white border-aje-ebony' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}

                                <button
                                    onClick={() => onPageChange(pagination.page + 1)}
                                    disabled={pagination.page === totalPages}
                                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${pagination.page === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <span className="sr-only">Siguiente</span>
                                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};