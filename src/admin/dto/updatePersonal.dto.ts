import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { Transform } from "class-transformer";



export class UpdatePersonalDto {
    @IsNumber()
    @IsNotEmpty()
    PersonalID: number;
    
    @IsString()
    @IsOptional()
    NombreCompleto?: string;
    
    @IsString()
    @IsOptional()
    Telefono?: string;
    
    @IsString()
    @IsOptional()
    Direccion?: string;

    @IsDate()
    @IsOptional()
    @Transform(({ value }) => {
        if (value === "" || !value) return undefined;
        const date = new Date(value);
        return isNaN(date.getTime()) ? undefined : date;
    })
    FechaContratacion?: Date
    
    @IsNumber()
    @IsOptional()
    CargoID?: number;
}
