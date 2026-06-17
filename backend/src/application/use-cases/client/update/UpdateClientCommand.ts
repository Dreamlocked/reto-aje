import { IsEmail, IsInt, IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateClientCommand {
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