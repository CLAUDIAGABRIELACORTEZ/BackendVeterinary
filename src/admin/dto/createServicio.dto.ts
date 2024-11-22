import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateServicioMedicoDto {
    @IsString()
    @IsNotEmpty()
    nombre: string;
    
    @IsNotEmpty()
    @IsNumber()
    precio: number;

    @IsString()
    @IsNotEmpty()
    descripcion: string;
    
}
