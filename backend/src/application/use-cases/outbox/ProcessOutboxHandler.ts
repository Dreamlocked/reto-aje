import { ClientModel, OutboxModel, RetoolService } from '../../../infrastructure';
import { RetoolClientPayloadMapper } from '../client/shared/RetoolClient';

export class ProcessOutboxHandler {
    async handle(): Promise<void> {
        const events = await OutboxModel.findAll({
            where: { processed: false },
            limit: 20,
            order: [['createdAt', 'ASC']]
        });

        for (const event of events) {
            const outboxEvent = event.dataValues;

            try {
                const dbClient = await ClientModel.findByPk(Number(outboxEvent.aggregateId));

                if (outboxEvent.type === 'ClientCreated') {
                    const retoolCreatePayload = RetoolClientPayloadMapper.toCreatePayload(outboxEvent.payload);
                    const retoolClient = await RetoolService.createClient(retoolCreatePayload);

                    if (dbClient) {
                        await dbClient.update({ retoolId: retoolClient?.id ?? null });
                    }
                }

                if (outboxEvent.type === 'ClientUpdated') {
                    // CORRECCIÓN AQUÍ: dbClient?.dataValues?.retoolId
                    const currentRetoolId = dbClient?.dataValues?.retoolId || outboxEvent.payload.retoolId;

                    if (!currentRetoolId) {
                        throw new Error('No se puede actualizar en Retool: no existe retoolId en DB ni en el payload');
                    }

                    const retoolUpdatePayload = RetoolClientPayloadMapper.toUpdatePayload(outboxEvent.payload);
                    await RetoolService.updateClient(currentRetoolId, retoolUpdatePayload);
                }

                if (outboxEvent.type === 'ClientDeleted') {
                    // CORRECCIÓN AQUÍ: dbClient?.dataValues?.retoolId
                    const currentRetoolId = dbClient?.dataValues?.retoolId || outboxEvent.payload.retoolId;

                    if (!currentRetoolId) {
                        throw new Error('No se puede eliminar en Retool: no existe retoolId en DB ni en el payload');
                    }

                    await RetoolService.deleteClient(currentRetoolId);
                }

                await event.update({
                    processed: true,
                    lastError: null
                });

            } catch (error) {
                await event.update({
                    retries: Number(outboxEvent.retries || 0) + 1,
                    lastError: error instanceof Error
                        ? error.message
                        : 'Error desconocido procesando Outbox'
                });
            }
        }
    }
}