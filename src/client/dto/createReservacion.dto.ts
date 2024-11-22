import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsDate, MaxLength, IsNumber } from 'class-validator';


export class CreateReservacionDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(80, { message: 'El motivo no puede exceder los 80 caracteres' })
    Motivo: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate({ message: 'La fecha y hora debe ser válida' })
    FechaHoraReservada: Date;

    @IsNotEmpty()
    @IsNumber()
    ServicioMedicoID: number;

    @IsNotEmpty()
    @IsNumber()
    MascotaID: number;
}
