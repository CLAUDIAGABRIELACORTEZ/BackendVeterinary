import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";


export class CreateInternacionDto {
    @IsNumber()
    @IsNotEmpty()
    PesoEntrada: number;

    @IsNumber()
    @IsNotEmpty()
    TemperaturaEntrada: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(1500, { message: 'Las notas no pueden exceder los 1500 caracteres.' })
    Notas: string;

    @IsNumber()
    @IsNotEmpty()
    MascotaID: number;
    
    CirugiaID: number | null;
}
