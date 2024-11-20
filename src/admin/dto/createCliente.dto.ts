import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateClienteDto {
    @IsString()
    @IsNotEmpty()
    NombreCompleto: string;
    
    @IsString()
    @IsNotEmpty()
    Telefono: string;

    @IsNotEmpty()
    @IsNumber()
    NumeroCI: number;

    @IsString()
    @IsNotEmpty()
    Direccion: string;
    
    @IsEmail()
    @IsNotEmpty()
    Email: string;
}
