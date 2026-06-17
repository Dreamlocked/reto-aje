import { ClientModel, OutboxModel, RetoolService } from '../../../infrastructure';

export class ProcessOutboxHandler {
    async handle(): Promise<void> {
        const events = await OutboxModel.findAll({
            where: {
                processed: false
            },
            limit: 20,
            order: [['createdAt', 'ASC']]
        });

        for (const event of events) {
            const outboxEvent = event.dataValues;

            try {
                if (outboxEvent.type === 'ClientCreated') {
                    const retoolClient = await RetoolService.createClient(outboxEvent.payload);

                    await ClientModel.update(
                        {
                            retoolId: retoolClient?.id ?? null
                        },
                        {
                            where: {
                                id: Number(outboxEvent.aggregateId)
                            }
                        }
                    );
                }

                if (outboxEvent.type === 'ClientUpdated') {
                    if (!outboxEvent.payload.retoolId) {
                        throw new Error('No se puede actualizar en Retool porque no existe retoolId');
                    }

                    await RetoolService.updateClient(
                        outboxEvent.payload.retoolId,
                        outboxEvent.payload
                    );
                }

                if (outboxEvent.type === 'ClientDeleted') {
                    if (!outboxEvent.payload.retoolId) {
                        throw new Error('No se puede eliminar en Retool porque no existe retoolId');
                    }

                    await RetoolService.deleteClient(outboxEvent.payload.retoolId);
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