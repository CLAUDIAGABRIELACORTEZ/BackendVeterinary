import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


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

    @IsNumber()
    @IsOptional()
    CargoID?: string;
}
