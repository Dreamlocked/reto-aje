import { useState } from 'react';

export const ClientUpdate = ({ client, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({ ...client });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: name === 'estado' ? parseInt(value) : value });
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="flex flex-col gap-4">
            <div>
                <label className="block text-sm font-bold text-aje-ebony">Cliente ID:</label>
                <input
                    type="text"
                    name="id"
                    readOnly
                    value={formData.id}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500 cursor-not-allowed focus:outline-none"
                />
            </div>
            <div>
                <label className="block text-sm font-bold text-aje-ebony">Nombres *</label>
                <input type="text" name="nombres" required maxLength={255} value={formData.nombres} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-aje-orange text-aje-ebony" />
            </div>
            <div>
                <label className="block text-sm font-bold text-aje-ebony">Email *</label>
                <input type="email" name="email" required maxLength={255} value={formData.email} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-aje-orange text-aje-ebony" />
            </div>
            <div>
                <label className="block text-sm font-bold text-aje-ebony">Teléfono</label>
                <input type="text" name="telefono" required maxLength={50} pattern="[0-9\s\-\+]+" value={formData.telefono} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-aje-orange text-aje-ebony" />
            </div>
            <div>
                <label className="block text-sm font-bold text-aje-ebony">Estado</label>
                <select name="estado" value={formData.estado} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-aje-orange bg-white text-aje-ebony cursor-pointer">
                    <option value={1}>Activo</option>
                    <option value={0}>Inactivo</option>
                </select>
            </div>

            <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={onCancel} className="cursor-pointer focus:outline-none focus:ring-0 px-4 py-2 text-gray-500 hover:text-aje-ebony bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors">
                    Cancelar
                </button>
                <button type="submit" className="font-medium cursor-pointer px-4 py-2 focus:outline-none focus:ring-0 p-2 text-aje-orange bg-aje-orange/10 hover:bg-aje-orange hover:text-white rounded-md transition-colors">
                    Actualizar
                </button>
            </div>
        </form>
    );
};