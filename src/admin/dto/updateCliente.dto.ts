import { IsNotEmpty, IsNumber, IsString } from "class-validator";



export class UpdateClienteDto {
    @IsNumber()
    @IsNotEmpty()
    clienteID: number;
    
    @IsString()
    @IsNotEmpty()
    NombreCompleto?: string;
    
    @IsString()
    @IsNotEmpty()
    Telefono?: string;
    
    @IsString()
    @IsNotEmpty()
    Direccion?: string;
}
