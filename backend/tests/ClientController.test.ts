import 'dotenv/config';
import 'reflect-metadata';
import express from 'express';
import request from 'supertest';
import { useExpressServer } from 'routing-controllers';

import { ClientController } from '../src/presentation/controllers/ClientController';

import {
    CreateClientHandler,
    GetAllClientsHandler,
    GetByIdClientHandler,
    UpdateClientHandler,
    DeleteClientHandler
} from '../src/application/use-cases/client';

describe('ClientController', () => {
    let app: express.Express;

    beforeAll(() => {
        app = express();

        // 1. Inicializamos routing-controllers
        useExpressServer(app, {
            controllers: [ClientController],
            defaultErrorHandler: true, // ✔️ routing-controllers ya sabe cuándo devolver 400 y cuándo 500
            validation: false
        });

        jest.spyOn(CreateClientHandler.prototype, 'handle').mockResolvedValue({
            id: 1, nombres: 'Juan Perez', email: 'juan@test.com', telefono: '123456789', estado: 1
        } as any);

        jest.spyOn(GetAllClientsHandler.prototype, 'handle').mockResolvedValue({
            items: [], total: 0
        } as any);

        jest.spyOn(GetByIdClientHandler.prototype, 'handle').mockResolvedValue({
            id: 1, nombres: 'Juan Perez', email: 'juan@test.com', telefono: '123456789', estado: 1
        } as any);

        jest.spyOn(UpdateClientHandler.prototype, 'handle').mockResolvedValue({
            id: 1, nombres: 'Juan Actualizado', email: 'juan@test.com', telefono: '123456789', estado: 1
        } as any);

        jest.spyOn(DeleteClientHandler.prototype, 'handle').mockResolvedValue(true as any);
    });

    afterAll(() => {
        jest.restoreAllMocks(); // Limpiamos los mocks al terminar las pruebas
    });

    // --- PRUEBA ENDPOINT 1: POST /api/v1/clients ---
    it('Debe crear un cliente y retornar 201', async () => {
        const response = await request(app)
            .post('/api/v1/clients')
            .send({
                nombres: 'Juan Perez',
                email: 'juan@test.com',
                telefono: '123456789',
                estado: 1
            });

        if (response.status === 500) {
            console.log('Motivo del error 500:', response.body); // Ahora response.body tendrá el error real
        }

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id', 1);
        expect(response.body).toHaveProperty('nombres', 'Juan Perez');
    });

    // --- PRUEBA ENDPOINT 2: GET /api/v1/clients ---
    it('Debe obtener clientes de forma paginada y retornar 200', async () => {
        const response = await request(app)
            .get('/api/v1/clients?page=1&limit=10');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('items');
    });

    it('Debe retornar error 400 si page o limit son inválidos en GET', async () => {
        const response = await request(app)
            .get('/api/v1/clients?page=-1&limit=10');

        expect(response.status).toBe(400);
        expect(response.text).toContain('page y limit deben ser números enteros mayores a 0');
    });

    // --- PRUEBA ENDPOINT 3: GET /api/v1/clients/:id ---
    it('Debe obtener un cliente por ID y retornar 200', async () => {
        const response = await request(app)
            .get('/api/v1/clients/1');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', 1);
    });

    it('Debe fallar si el ID no es positivo en GET por ID', async () => {
        const response = await request(app)
            .get('/api/v1/clients/-5');

        expect(response.status).toBe(400);
        expect(response.text).toContain('El id debe ser un número entero mayor a 0');
    });

    // --- PRUEBA ENDPOINT 4: PATCH /api/v1/clients/:id ---
    it('Debe actualizar un cliente y retornar 200', async () => {
        const response = await request(app)
            .patch('/api/v1/clients/1')
            .send({
                nombres: 'Juan Actualizado',
                email: 'juan@test.com',
                telefono: '123456789',
                estado: 1
            });

        if (response.status === 500) {
            console.log('Motivo del error 500:', response.body); // Ahora response.body tendrá el error real
        }

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('nombres', 'Juan Actualizado');
    });

    it('Debe eliminar un cliente y retornar 204', async () => {
        const response = await request(app)
            .delete('/api/v1/clients/1');

        expect(response.status).toBe(204);
    });
});