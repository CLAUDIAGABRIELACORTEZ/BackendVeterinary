import { IsNotEmpty, IsNumber, IsString, Matches, MaxLength } from "class-validator";


export class CreateConsultaDto {
    @IsNumber()
    @IsNotEmpty()
    @Matches(/^\d+(\.\d{1,2})?$/, { message: 'El peso debe tener como máximo dos decimales.' })
    Peso: number;

    @IsNumber()
    @IsNotEmpty()
    @Matches(/^\d+(\.\d{1,2})?$/, { message: 'La temperatura debe tener como máximo dos decimales.' })
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
