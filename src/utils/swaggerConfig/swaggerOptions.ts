
export const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Documentación de la API',
            version: '1.0.0',
            description: 'Documentación de la API para gestionar bookings, rooms, contacts y users',
        },
        tags: [
            { name: 'Login', description: 'Autentificación con token' },
            { name: 'Bookings', description: 'Gestión de reservas' },
            { name: 'Rooms', description: 'Gestión de habitaciones' },
            { name: 'Contacts', description: 'Gestión de contactos' },
            { name: 'Users', description: 'Gestión de usuarios' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/controllers/*.ts'],
}