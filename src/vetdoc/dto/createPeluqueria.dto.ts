import { IsBoolean, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";


export class CreatePeluqueriaDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50, { message: 'La descripción del corte no puede exceder los 50 caracteres' })
    TipoCorte: string;
    
    @IsNotEmpty()
    @IsBoolean()
    Lavado: boolean;

    @IsNumber()
    @IsNotEmpty()
    ReservacionID: number;

    @IsNumber()
    @IsNotEmpty()
    MascotaID: number;
}
