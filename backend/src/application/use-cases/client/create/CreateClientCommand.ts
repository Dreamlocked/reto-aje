import { IsEmail, IsNotEmpty, MaxLength, IsInt } from 'class-validator';

export class CreateClientCommand {
    @IsNotEmpty({ message: 'Los nombres son obligatorios' })
    @MaxLength(255, { message: 'Los nombres no deben superar los 255 caracteres' })
    nombres!: string;

    @IsNotEmpty({ message: 'El email es obligatorio' })
    @IsEmail({}, { message: 'Formato de email inválido' })
    @MaxLength(255, { message: 'El email no debe superar los 255 caracteres' })
    email!: string;

    @IsNotEmpty({ message: 'El teléfono es obligatorio' })
    @MaxLength(50, { message: 'El teléfono no debe superar los 50 caracteres' })
    telefono!: string;

    @IsInt({ message: 'El estado debe ser un número entero' })
    estado!: number;
}