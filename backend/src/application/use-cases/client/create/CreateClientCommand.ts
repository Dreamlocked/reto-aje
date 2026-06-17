import { IsEmail, IsNotEmpty, MaxLength, IsInt } from 'class-validator';

export class CreateClientCommand {
    @IsNotEmpty({ message: 'Los nombres son obligatorios' })
    @MaxLength(255)
    nombres!: string;

    @IsEmail({}, { message: 'Formato de email inválido' })
    email!: string;

    @MaxLength(50)
    telefono!: string;

    @IsInt()
    estado!: number;
}