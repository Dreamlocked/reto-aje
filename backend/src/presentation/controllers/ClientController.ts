import {
    JsonController,
    Post,
    Delete,
    Param,
    Body,
    HttpCode,
    OnUndefined,
    Put,
    Get,
    QueryParam,
    BadRequestError,
    UseBefore, Patch
} from 'routing-controllers';
import {
    CreateClientHandler,
    CreateClientCommand,
    DeleteClientHandler,
    GetAllClientsHandler,
    GetAllClientsQuery,
    GetByIdClientHandler,
    GetByIdClientQuery,
    UpdateClientHandler,
    UpdateClientCommand
} from "../../application/use-cases/client";
import {ValidateInput} from "../middlewares/Validator";

@JsonController('/api/v1/clients')
export class ClientController {
    private validatePositiveId(id: number) {
        const parsedId = Number(id);

        if (!Number.isInteger(parsedId) || parsedId < 1) {
            throw new BadRequestError('El id debe ser un número entero mayor a 0');
        }

        return parsedId;
    }

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
    async createClient(@Body({ validate: false }) body: unknown) {
        const input = await ValidateInput(CreateClientCommand, body);

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
    async getAllClients(
        @QueryParam('page') page?: number,
        @QueryParam('limit') limit?: number
    ) {
        const query = new GetAllClientsQuery();

        query.page = page === undefined ? 1 : Number(page);
        query.limit = limit === undefined ? 10 : Number(limit);

        if (
            !Number.isInteger(query.page) ||
            !Number.isInteger(query.limit) ||
            query.page < 1 ||
            query.limit < 1
        ) {
            throw new BadRequestError('page y limit deben ser números enteros mayores a 0');
        }

        const handler = new GetAllClientsHandler();
        return await handler.handle(query);
    }

    /**
     * @swagger
     * /api/v1/clients/{id}:
     *   get:
     *     summary: Obtiene un cliente por su ID
     *     tags: [Clients]
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: integer
     *         description: ID del cliente
     *     responses:
     *       200:
     *         description: Cliente obtenido exitosamente
     *       404:
     *         description: Cliente no encontrado
     */
    @HttpCode(200)
    @Get('/:id')
    async getClientById(@Param('id') id: number) {
        const parsedId = this.validatePositiveId(id);

        const handler = new GetByIdClientHandler();
        const query = new GetByIdClientQuery(parsedId);

        return await handler.handle(query);
    }

    /**
     * @swagger
     * /api/v1/clients/{id}:
     *   patch:
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
    @Patch('/:id')
    async updateClient(@Param('id') id: number, @Body({ validate: false }) body: unknown) {
        const parsedId = this.validatePositiveId(id);
        const input = await ValidateInput(UpdateClientCommand, body);

        const handler = new UpdateClientHandler();
        return await handler.handle(parsedId, input);
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
        const parsedId = this.validatePositiveId(id);

        const handler = new DeleteClientHandler();
        await handler.handle(parsedId);

        return;
    }
}