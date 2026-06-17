import { NotFoundError } from 'routing-controllers';
import { ClientModel, DbContext, OutboxModel, RetoolService } from '../../../../infrastructure';
import { UpdateClientCommand } from './UpdateClientCommand';

export class UpdateClientHandler {
    async handle(id: number, input: UpdateClientCommand) {
        const client = await ClientModel.findByPk(id);

        if (!client) {
            throw new NotFoundError(`El cliente con id ${id} no existe.`);
        }

        let shouldCreateOutbox = false;
        let retoolError: unknown = null;

        const currentClient = client.dataValues;
        const payload = {
            ...currentClient,
            ...input
        };

        if (currentClient.retoolId) {
            try {
                await RetoolService.updateClient(currentClient.retoolId, payload);
            } catch (error) {
                shouldCreateOutbox = true;
                retoolError = error;
            }
        } else {
            shouldCreateOutbox = true;
            retoolError = new Error('El cliente no tiene retoolId asociado');
        }

        const transaction = await DbContext.transaction();

        try {
            await ClientModel.update(
                { ...input },
                {
                    where: { id },
                    transaction
                }
            );

            const updatedClient = await ClientModel.findByPk(id, { transaction });

            if (shouldCreateOutbox) {
                await OutboxModel.create({
                    aggregateType: 'Client',
                    aggregateId: id.toString(),
                    type: 'ClientUpdated',
                    payload: updatedClient?.dataValues,
                    processed: false,
                    retries: 0,
                    lastError: retoolError instanceof Error ? retoolError.message : 'Error desconocido al sincronizar con Retool'
                }, { transaction });
            }

            await transaction.commit();

            return updatedClient?.dataValues;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}