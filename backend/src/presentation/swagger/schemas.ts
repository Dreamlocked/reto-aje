// backend/src/presentation/swagger/schemas.ts
export const swaggerSchemas = {
    CreateClientCommand: {
        type: 'object',
        required: ['nombres', 'email', 'telefono', 'estado'],
        properties: {
            nombres: { type: 'string', maxLength: 255, example: 'Juan Pérez' },
            email: { type: 'string', format: 'email', example: 'juan@correo.com' },
            telefono: { type: 'string', maxLength: 50, example: '999888777' },
            estado: { type: 'integer', example: 1 }
        }
    },
    UpdateClientCommand: {
        type: 'object',
        required: ['nombres', 'email', 'telefono', 'estado'],
        properties: {
            nombres: { type: 'string', maxLength: 255, example: 'Juan Pérez' },
            email: { type: 'string', format: 'email', example: 'juan@correo.com' },
            telefono: { type: 'string', maxLength: 50, example: '999888777' },
            estado: { type: 'integer', example: 1 }
        }
    }
};