import { Transform } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreatePersonalDto {
    @IsString()
    @IsNotEmpty()
    NombreCompleto: string;

    @IsString()
    @IsNotEmpty()
    Telefono: string;

    @IsString()
    @IsNotEmpty()
    Direccion: string;

    @IsNotEmpty()
    @IsNumber()
    NumeroCI: number;

    @IsEmail()
    @IsNotEmpty()
    Email: string;

    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    FechaContratacion: Date;
    
    @IsNotEmpty()
    @IsNumber()
    CargoID: number;
    
    @IsNotEmpty()
    @IsNumber()
    ProfesionID: number;
}
