import { Type } from "class-transformer";
import { AnalisisResultado } from "src/utils/index.utils";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";


export class CreateAnalisisDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100, { message: 'El tipo de análisis no puede exceder los 80 caracteres' })
    TipoAnalisis: string;
    
    @IsNotEmpty()
    @Type(() => Date)
    @IsDate({ message: 'La fecha y hora debe ser válida' })
    FechaAnalisis: Date;

    @IsNumber()
    ConsultaID: number;

    @IsNumber()
    InternacionID: number;

    @IsEnum(AnalisisResultado, { message: 'El resultado debe ser uno de: Normal, Bajo, Elevado, Bueno, Critico' })
    Resultado: AnalisisResultado;
}
