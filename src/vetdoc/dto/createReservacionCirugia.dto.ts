import { Type } from 'class-transformer';
import { IsNotEmpty, IsDate, IsNumber } from 'class-validator';


export class CreateReservacionCirugiaDto {
    @IsNotEmpty()
    @IsNumber()
    CI: number;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate({ message: 'La fecha y hora debe ser válida' })
    FechaHoraReservada: Date;
}
