import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";


export class CreateRecetaDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100, { message: 'El medicamento no puede exceder los 80 caracteres' })
    Medicamento: string;
    
    @IsNotEmpty()
    @IsString()
    @MaxLength(50, { message: 'La dosis no puede exceder los 100 caracteres' })
    Dosis: string;
    
    @IsNotEmpty()
    @IsString()
    @MaxLength(200, { message: 'Las indicaciones no pueden exceder los 200 caracteres' })
    Indicaciones: string;

    ConsultaID: number | null;

    InternacionID: number | null;
}
