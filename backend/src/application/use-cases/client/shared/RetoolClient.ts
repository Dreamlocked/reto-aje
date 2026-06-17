export type RetoolCreateClientPayload = {
    nombres: string;
    email: string;
    telefono: string;
    estado: boolean;
    fecha_creacion: string;
};

export type RetoolUpdateClientPayload = {
    id: number;
    nombres?: string;
    email?: string;
    telefono?: string;
    estado?: boolean;
    fecha_creacion: string;
};

type CreateClientSource = {
    nombres: string;
    email: string;
    telefono: string;
    estado?: number | boolean;
    createdAt?: Date | string;
};

type UpdateClientSource = {
    id?: number;
    nombres?: string;
    email?: string;
    telefono?: string;
    estado?: number | boolean;
    retoolId?: number;
    createdAt?: Date | string;
};

export class RetoolClientPayloadMapper {
    private static formatRetoolDate(date: Date): string {
        const month = date.toLocaleString('en-US', { month: 'short' });
        const day = date.getDate();
        const year = date.getFullYear();
        const hour12 = date.getHours() % 12 || 12;
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const period = date.getHours() >= 12 ? 'PM' : 'AM';

        return `${month} ${day}, ${year} ${hour12}:${minutes} ${period}`;
    }

    private static toBooleanEstado(estado?: number | boolean): boolean {
        if (typeof estado === 'boolean') {
            return estado;
        }

        return (estado ?? 1) === 1;
    }

    static toCreatePayload(input: CreateClientSource): RetoolCreateClientPayload {
        const createdAt = input.createdAt
            ? new Date(input.createdAt)
            : new Date();

        return {
            nombres: input.nombres,
            email: input.email,
            telefono: input.telefono,
            estado: RetoolClientPayloadMapper.toBooleanEstado(input.estado),
            fecha_creacion: RetoolClientPayloadMapper.formatRetoolDate(createdAt)
        };
    }

    static toUpdatePayload(input: UpdateClientSource): RetoolUpdateClientPayload {
        const createdAt = input.createdAt
            ? new Date(input.createdAt)
            : new Date();

        return {
            id: input.retoolId!,
            ...(input.nombres !== undefined && { nombres: input.nombres }),
            ...(input.email !== undefined && { email: input.email }),
            ...(input.telefono !== undefined && { telefono: input.telefono }),
            ...(input.estado !== undefined && {
                estado: RetoolClientPayloadMapper.toBooleanEstado(input.estado)
            }),
            fecha_creacion: RetoolClientPayloadMapper.formatRetoolDate(createdAt)
        };
    }
}