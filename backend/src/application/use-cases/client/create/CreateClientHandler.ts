import { randomUUID } from 'crypto';
import { CreateClientOutput } from './CreateClientOutput';
import { CreateClientCommand } from './CreateClientCommand';
import { ClientModel, OutboxModel, DbContext, RetoolService } from '../../../../infrastructure';

export class CreateClientHandler {
    async handle(input: CreateClientCommand): Promise<CreateClientOutput> {
        const codigo = randomUUID();

        let retoolClient: any = null;
        let shouldCreateOutbox = false;
        let retoolError: unknown = null;

        const payload = {
            ...input,
            codigo,
            estado: input.estado ?? 1
        };

        try {
            retoolClient = await RetoolService.createClient(payload);
        } catch (error) {
            shouldCreateOutbox = true;
            retoolError = error;
        }

        const transaction = await DbContext.transaction();

        try {
            const newClient = await ClientModel.create({
                ...payload,
                retoolId: retoolClient?.id ?? null
            } as any, { transaction });

            if (shouldCreateOutbox) {
                await OutboxModel.create({
                    aggregateType: 'Client',
                    aggregateId: newClient.dataValues.id.toString(),
                    type: 'ClientCreated',
                    payload: newClient.dataValues,
                    processed: false,
                    retries: 0,
                    lastError: retoolError instanceof Error ? retoolError.message : 'Error desconocido al sincronizar con Retool'
                }, { transaction });
            }

            await transaction.commit();

            return new CreateClientOutput(newClient.dataValues.id);
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}