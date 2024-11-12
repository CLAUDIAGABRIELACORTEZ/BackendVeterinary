import { TipoCorte } from "src/utils/index.utils";
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber } from "class-validator";


export class CreatePeluqueriaDto {
    @IsNotEmpty()
    @IsEnum(TipoCorte)
    TipoCorte: TipoCorte;
    
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
