import { Type } from 'class-transformer';
import { reservacion_Estado } from '@prisma/client';
import { IsNotEmpty, IsString, IsInt, IsDate, IsEnum, MaxLength, Min } from 'class-validator';


export class CreateReservacionDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(80, { message: 'El motivo no puede exceder los 80 caracteres' })
    Motivo: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate({ message: 'La fecha y hora debe ser válida' })
    FechaHoraReservada: Date;

    // @IsNotEmpty()
    // @IsEnum(reservacion_Estado, { 
    //     message: 'El estado debe ser uno válido (Pendiente, Confirmada, Cancelada, etc.)' 
    // })
    // Estado: reservacion_Estado;

    @IsNotEmpty()
    @IsInt()
    @Min(1, { message: 'El ID de usuario debe ser mayor a 0' })
    @Type(() => Number)
    UsuarioID: number;
}
