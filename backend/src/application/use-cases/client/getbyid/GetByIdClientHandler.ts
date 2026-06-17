import { NotFoundError } from 'routing-controllers';
import { ClientModel } from '../../../../infrastructure';
import { GetByIdClientOutput } from './GetByIdClientOutput';
import { GetByIdClientQuery } from './GetByIdClientQuery';

export class GetByIdClientHandler {
    async handle(query: GetByIdClientQuery): Promise<GetByIdClientOutput> {
        const client = await ClientModel.findOne({
            where: {
                id: query.id,
                estado: 1
            }
        });

        if (!client) {
            throw new NotFoundError(`El cliente con id ${query.id} no existe.`);
        }

        return new GetByIdClientOutput(client.dataValues);
    }
}