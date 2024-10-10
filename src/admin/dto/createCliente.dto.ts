import { IsEmail, IsNotEmpty, IsString } from "class-validator";



export class CreateClienteDto {
    @IsString()
    @IsNotEmpty()
    NombreCompleto: string;
    
    @IsString()
    @IsNotEmpty()
    Telefono: string;

    @IsString()
    @IsNotEmpty()
    Direccion: string;
    
    @IsEmail()
    @IsNotEmpty()
    Email: string;

    @IsNotEmpty()
    @IsString()
    JWT: string;
}
