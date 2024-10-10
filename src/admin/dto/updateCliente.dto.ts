import { IsNotEmpty, IsNumber, IsString } from "class-validator";



export class UpdateClienteDto {
    @IsNumber()
    @IsNotEmpty()
    clienteID: number;
    
    @IsString()
    NombreCompleto: string;
    
    @IsString()
    Telefono: string;

    @IsString()
    Direccion: string;

    @IsNotEmpty()
    @IsString()
    JWT: string;
}
