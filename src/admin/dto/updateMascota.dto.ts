import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";



export class UpdateMascotaDto {
    @IsNumber()
    @IsNotEmpty()
    mascotaID: number;
    
    @IsString()
    @IsOptional()
    Nombre?: string;
    
    @IsString()
    @IsOptional()
    Sexo?: string;
    
    @IsDate()
    @IsOptional()
    @Transform(({ value }) => {
        if (value === "" || !value) return undefined;
        const date = new Date(value);
        return isNaN(date.getTime()) ? undefined : date;
    })
    FechaDeNacimiento?: Date
    
    @IsString()
    @IsOptional()
    Observaciones?: string;
}
