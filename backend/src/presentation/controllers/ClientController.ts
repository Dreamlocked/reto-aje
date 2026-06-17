import { JsonController, Post, Delete, Param, Body, HttpCode, OnUndefined, Put, Get, QueryParams } from 'routing-controllers';
import {
    CreateClientHandler,
    CreateClientCommand,
    DeleteClientHandler,
    GetAllClientsHandler,
    GetAllClientsQuery,
    UpdateClientHandler,
    UpdateClientCommand
} from "../../application/use-cases/client";

@JsonController('/api/v1/clients')
export class ClientController {

    /**
     * @swagger
     * /api/v1/clients:
     *   post:
     *     summary: Registra un nuevo cliente
     *     tags: [Clients]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CreateClientCommand'
     *     responses:
     *       201:
     *         description: Cliente creado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 id: { type: integer, example: 1 }
     *       400:
     *         description: Error de validación (Problem Details)
     */
    @HttpCode(201)
    @Post('/')
    async createClient(@Body() input: CreateClientCommand) {
        const handler = new CreateClientHandler();
        return await handler.handle(input);
    }

    /**
     * @swagger
     * /api/v1/clients:
     *   get:
     *     summary: Obtiene clientes de forma paginada
     *     tags: [Clients]
     *     parameters:
     *       - in: query
     *         name: page
     *         required: false
     *         schema:
     *           type: integer
     *           example: 1
     *         description: Número de página
     *       - in: query
     *         name: limit
     *         required: false
     *         schema:
     *           type: integer
     *           example: 10
     *         description: Cantidad de registros por página
     *     responses:
     *       200:
     *         description: Listado paginado de clientes
     */
    @HttpCode(200)
    @Get('/')
    async getAllClients(@QueryParams() input: GetAllClientsQuery) {
        const handler = new GetAllClientsHandler();
        return await handler.handle(input);
    }

    /**
     * @swagger
     * /api/v1/clients/{id}:
     *   put:
     *     summary: Actualiza un cliente existente
     *     tags: [Clients]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del cliente
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UpdateClientCommand'
     *     responses:
     *       200:
     *         description: Cliente actualizado exitosamente
     *       404:
     *         description: Cliente no encontrado
     */
    @HttpCode(200)
    @Put('/:id')
    async updateClient(@Param('id') id: number, @Body() input: UpdateClientCommand) {
        const handler = new UpdateClientHandler();
        return await handler.handle(id, input);
    }

    /**
     * @swagger
     * /api/v1/clients/{id}:
     *   delete:
     *     summary: Elimina un cliente existente
     *     tags: [Clients]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del cliente
     *     responses:
     *       204:
     *         description: Cliente eliminado exitosamente (Sin contenido)
     *       404:
     *         description: Cliente no encontrado
     */
    @HttpCode(204)
    @OnUndefined(204)
    @Delete('/:id')
    async deleteClient(@Param('id') id: number) {
        const handler = new DeleteClientHandler();
        await handler.handle(id);
        return;
    }
}