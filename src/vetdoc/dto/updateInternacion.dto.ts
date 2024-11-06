import { IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";


export class UpdateInternacionDto {
    @IsNumber()
    @IsNotEmpty()
    InternacionID: number;

    @IsString()
    @MaxLength(1500, { message: 'Las notas no pueden exceder los 500 caracteres.' })
    Notas: string;

    @IsEnum(['Completado'])
    Estado: 'Completado'
}
