import { IsDecimal, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";


export class CreateConsultaDto {
    @IsDecimal()
    @IsNotEmpty()
    Peso: number;

    @IsDecimal()
    @IsNotEmpty()
    Temperatura: number;

    @IsNumber()
    @IsNotEmpty()
    ReservacionID: number;

    @IsNumber()
    @IsNotEmpty()
    MascotaID: number;

    @IsNotEmpty()
    @IsString()
    @MaxLength(500, { message: 'El diagnóstico no puede exceder los 500 caracteres.' })
    Diagnostico: string;
    
    @IsString()
    @MaxLength(500, { message: 'El tratamiento no puede exceder los 500 caracteres.' })
    Tratamiento: string;
}
