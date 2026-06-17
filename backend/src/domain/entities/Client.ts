import { IsEmail, IsNotEmpty, MaxLength, IsOptional, IsInt, IsUUID } from 'class-validator';

export class Client {
    @IsOptional()
    id?: number;

    @IsOptional()
    @IsUUID()
    codigo?: string;

    @IsOptional()
    @IsInt()
    retoolId?: number;

    @IsNotEmpty({ message: 'Los nombres son obligatorios' })
    @MaxLength(255)
    nombres: string;

    @IsEmail({}, { message: 'Formato de email inválido' })
    email: string;

    @MaxLength(50)
    telefono: string;

    @IsInt()
    estado: number;

    constructor(data: Partial<Client>) {
        Object.assign(this, data);
    }
}