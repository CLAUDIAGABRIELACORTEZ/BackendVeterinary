import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";


export class UpdateConsultaDto {
    @IsNumber()
    @IsNotEmpty()
    ServicioID: number;

    @IsNumber()
    @IsNotEmpty()
    ConsultaID: number;

    @IsString()
    @MaxLength(500, { message: 'El diagnóstico no puede exceder los 500 caracteres.' })
    Diagnostico: string;
    
    @IsString()
    @MaxLength(500, { message: 'El tratamiento no puede exceder los 500 caracteres.' })
    Tratamiento: string;
}
