import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Transform } from "class-transformer";



export class UpdatePersonalDto {
    @IsNumber()
    @IsNotEmpty()
    personalID: number;
    
    @IsString()
    NombreCompleto: string;

    @IsString()
    Telefono: string;

    @IsString()
    Direccion: string;

    @IsDate()
    @Transform(({ value }) => new Date(value))
    FechaContratacion: Date;
    
    @IsNumber()
    CargoID: number;
    
    @IsNumber()
    ProfesionID: number;
}
