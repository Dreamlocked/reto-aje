import { NotFoundError } from 'routing-controllers';
import { ClientModel, DbContext, OutboxModel, RetoolService } from '../../../../infrastructure';
import { UpdateClientCommand } from './UpdateClientCommand';
import { RetoolClientPayloadMapper } from "../shared/RetoolClient";

export class UpdateClientHandler {
    async handle(id: number, input: UpdateClientCommand) {
        const client = await ClientModel.findByPk(id);

        if (!client) {
            throw new NotFoundError(`El cliente con id ${id} no existe.`);
        }

        const transaction = await DbContext.transaction();
        let shouldCreateOutbox = false;
        let retoolError: unknown = null;

        try {
            // Actualizamos la base de datos
            await client.update(input, { transaction });

            // CORRECCIÓN AQUÍ: Usar client.dataValues.retoolId
            const currentRetoolId = client.dataValues.retoolId;

            if (currentRetoolId) {
                try {
                    const retoolUpdatePayload = RetoolClientPayloadMapper.toUpdatePayload({
                        retoolId: currentRetoolId,
                        ...input,
                        createdAt: client.dataValues.createdAt.toISOString(),
                    });
                    await RetoolService.updateClient(currentRetoolId, retoolUpdatePayload);
                } catch (error) {
                    shouldCreateOutbox = true;
                    retoolError = error;
                    console.warn('[UpdateClientHandler] Retool falló. Se guardará evento en Outbox.');
                }
            } else {
                shouldCreateOutbox = true;
                retoolError = new Error('El cliente aún no tiene retoolId asociado');
            }

            if (shouldCreateOutbox) {
                await OutboxModel.create({
                    aggregateType: 'Client',
                    aggregateId: id.toString(),
                    type: 'ClientUpdated',
                    payload: {
                        ...RetoolClientPayloadMapper.toUpdatePayload(client.dataValues)
                    },
                    processed: false,
                    retries: 0,
                    lastError: retoolError instanceof Error ? retoolError.message : 'Error al sincronizar con Retool'
                }, { transaction });
            }

            await transaction.commit();

            return client.dataValues;

        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}