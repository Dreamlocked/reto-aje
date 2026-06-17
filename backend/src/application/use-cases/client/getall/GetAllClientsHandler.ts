import { ClientModel } from '../../../../infrastructure';
import { GetAllClientsQuery } from './GetAllClientsQuery';

export class GetAllClientsHandler {
    async handle(query: GetAllClientsQuery) {
        const page = query.page || 1;
        const limit = query.limit || 10;
        const offset = (page - 1) * limit;

        const { rows, count } = await ClientModel.findAndCountAll({
            where: {
                estado: 1
            },
            limit,
            offset,
            order: [['id', 'DESC']]
        });

        return {
            data: rows.map(client => client.dataValues),
            pagination: {
                page,
                limit,
                total: count,
                totalPages: Math.ceil(count / limit)
            }
        };
    }
}