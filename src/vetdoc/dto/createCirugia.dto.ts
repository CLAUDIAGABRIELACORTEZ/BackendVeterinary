import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";


export class CreateCirugiaDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50, { message: 'El tipo de cirugía no puede exceder los 50 caracteres.' })
    TipoDeCirugia: string;
    
    @IsNotEmpty()
    @IsString()
    @MaxLength(500, { message: 'Las notas no pueden exceder los 500 caracteres.' })
    Notas: string;
    
    @IsNumber()
    @IsNotEmpty()
    ServicioID: number;
}
