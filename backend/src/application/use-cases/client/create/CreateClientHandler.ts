import {randomUUID} from 'crypto';
import {CreateClientOutput} from './CreateClientOutput';
import {CreateClientCommand} from './CreateClientCommand';
import {ClientModel, OutboxModel, DbContext, RetoolService} from '../../../../infrastructure';
import {RetoolClientPayloadMapper} from "../shared/RetoolClient";

export class CreateClientHandler {
    async handle(input: CreateClientCommand): Promise<CreateClientOutput> {
        const codigo = randomUUID();

        let retoolClient: any = null;
        let shouldCreateOutbox = false;
        let retoolError: unknown = null;

        const clientPayload = {
            ...input,
            codigo,
            estado: input.estado ?? 1,
            fecha_creacion: new Date().toISOString(),
        };

        const retoolCreatePayload = RetoolClientPayloadMapper.toCreatePayload(clientPayload);

        try {
            retoolClient = await RetoolService.createClient(retoolCreatePayload);
        } catch (error) {
            shouldCreateOutbox = true;
            retoolError = error;
            console.warn('[CreateClientHandler] Retool falló después de todos los reintentos. Se guardará evento ClientCreated en Outbox.');
        }

        const transaction = await DbContext.transaction();

        try {
            const newClient = await ClientModel.create({
                ...clientPayload,
                retoolId: retoolClient?.id ?? null
            } as any, {transaction});

            if (shouldCreateOutbox) {
                await OutboxModel.create({
                    aggregateType: 'Client',
                    aggregateId: newClient.dataValues.id.toString(),
                    type: 'ClientCreated',
                    payload: RetoolClientPayloadMapper.toCreatePayload(newClient.dataValues),
                    processed: false,
                    retries: 0,
                    lastError: retoolError instanceof Error ? retoolError.message : 'Error desconocido al sincronizar con Retool'
                }, {transaction});
            }

            await transaction.commit();

            return new CreateClientOutput(newClient.dataValues.id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}