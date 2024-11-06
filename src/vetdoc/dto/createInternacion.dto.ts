import { IsNotEmpty, IsNumber, IsString, Matches, MaxLength } from "class-validator";


export class CreateInternacionDto {
    @IsNumber()
    @IsNotEmpty()
    @Matches(/^\d+(\.\d{1,2})?$/, { message: 'El peso debe tener como máximo dos decimales.' })
    PesoEntrada: number;

    @IsNumber()
    @IsNotEmpty()
    @Matches(/^\d+(\.\d{1,2})?$/, { message: 'La temperatura debe tener como máximo dos decimales.' })
    TemperaturaEntrada: number;

    @IsString()
    @IsNotEmpty()
    @MaxLength(1500, { message: 'Las notas no pueden exceder los 1500 caracteres.' })
    Notas: string;
    
    @IsNumber()
    @IsNotEmpty()
    ServicioID: number;

    @IsNumber()
    CirugiaID: number;
}
