import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";


export class UpdateInternacionDto {
    @IsNumber()
    @IsNotEmpty()
    ServicioID: number;

    @IsNumber()
    @IsNotEmpty()
    InternacionID: number;

    @IsString()
    @MaxLength(1500, { message: 'Las notas no pueden exceder los 1500 caracteres.' })
    Notas: string;

    @IsNumber()
    @IsNotEmpty()
    PesoSalida: number;

    @IsNumber()
    @IsNotEmpty()
    TemperaturaSalida: number;
}
