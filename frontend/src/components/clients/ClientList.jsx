export const ClientList = ({ clients, onEdit, onDelete }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
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
                    {clients.length === 0 ? (
                        <tr><td colSpan="6" className="p-8 text-center text-gray-500 font-medium">No se encontraron clientes.</td></tr>
                    ) : (
                        clients.map(client => (
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
                                    {/* Botón Editar (Lápiz) */}
                                    <button onClick={() => onEdit(client)} title="Editar" className="cursor-pointer focus:outline-none focus:ring-0 p-2 text-aje-orange bg-aje-orange/10 hover:bg-aje-orange hover:text-white rounded-md transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                    </button>
                                    {/* Botón Eliminar (Basurero) */}
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
        </div>
    );
};