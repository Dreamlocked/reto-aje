import { useState } from 'react';

export const ClientCreate = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        nombres: '',
        email: '',
        telefono: '',
        estado: 1
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getInputClassName = (fieldName) => {
        const baseClassName = 'mt-1 w-full p-2 border rounded-md focus:outline-none focus:ring-0 text-aje-ebony';

        return errors[fieldName]
            ? `${baseClassName} border-red-500 focus:border-red-500 bg-red-50`
            : `${baseClassName} border-gray-300 focus:border-aje-green`;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: name === 'estado' ? parseInt(value) : value
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setIsSubmitting(true);

        try {
            await onSubmit(formData);
        } catch (error) {
            setErrors(error.validationErrors || {
                general: 'No se pudo registrar el cliente. Revisa los datos ingresados.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            {errors.general && (
                <p className="text-sm text-red-600 font-medium">
                    {errors.general}
                </p>
            )}

            <div>
                <label className="block text-sm font-bold text-aje-ebony">
                    Nombres *
                </label>
                <input
                    type="text"
                    name="nombres"
                    maxLength={255}
                    value={formData.nombres}
                    onChange={handleChange}
                    className={getInputClassName('nombres')}
                />
                {errors.nombres && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.nombres}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-bold text-aje-ebony">
                    Email *
                </label>
                <input
                    type="text"
                    name="email"
                    maxLength={255}
                    value={formData.email}
                    onChange={handleChange}
                    className={getInputClassName('email')}
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-bold text-aje-ebony">
                    Teléfono *
                </label>
                <input
                    type="text"
                    name="telefono"
                    maxLength={50}
                    value={formData.telefono}
                    onChange={handleChange}
                    className={getInputClassName('telefono')}
                />
                {errors.telefono && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.telefono}
                    </p>
                )}
            </div>

            <div>
                <label className="block text-sm font-bold text-aje-ebony">
                    Estado
                </label>
                <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-0 focus:border-aje-green bg-white text-aje-ebony cursor-pointer"
                >
                    <option value={1}>Activo</option>
                    <option value={0}>Inactivo</option>
                </select>
            </div>

            <div className="flex justify-end gap-3 mt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    className="cursor-pointer focus:outline-none focus:ring-0 px-4 py-2 text-gray-500 hover:text-aje-ebony bg-gray-100 hover:bg-gray-200 rounded-md font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    Cancelar
                </button>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="font-medium cursor-pointer px-4 py-2 focus:outline-none focus:ring-0 p-2 text-aje-green bg-aje-green/10 hover:bg-aje-green hover:text-white rounded-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Registrando...' : 'Registrar'}
                </button>
            </div>
        </form>
    );
};