import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";


export class UpdateCirugiaDto {
    @IsNumber()
    @IsNotEmpty()
    CirugiaID: number;

    @IsString()
    @MaxLength(500, { message: 'Las notas no pueden exceder los 500 caracteres.' })
    Notas: string;

    @IsEnum(['Completado'])
    Estado: 'Completado'
}
