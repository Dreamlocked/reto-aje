import { NotFoundError } from 'routing-controllers';
import { ClientModel, DbContext, OutboxModel, RetoolService } from '../../../../infrastructure';

export class DeleteClientHandler {
    async handle(id: number): Promise<void> {
        const client = await ClientModel.findByPk(id);

        if (!client) {
            throw new NotFoundError(`El cliente con id ${id} no existe.`);
        }

        let shouldCreateOutbox = false;
        let retoolError: unknown = null;

        const currentClient = client.dataValues;

        if (currentClient.retoolId) {
            try {
                await RetoolService.deleteClient(currentClient.retoolId);
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
                { estado: 0 },
                {
                    where: { id },
                    transaction
                }
            );

            if (shouldCreateOutbox) {
                await OutboxModel.create({
                    aggregateType: 'Client',
                    aggregateId: id.toString(),
                    type: 'ClientDeleted',
                    payload: currentClient,
                    processed: false,
                    retries: 0,
                    lastError: retoolError instanceof Error ? retoolError.message : 'Error desconocido al sincronizar con Retool'
                }, { transaction });
            }

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }
}