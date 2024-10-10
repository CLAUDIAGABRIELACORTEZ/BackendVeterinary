import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Transform } from "class-transformer";



export class UpdatePersonalDto {
    @IsNumber()
    @IsNotEmpty()
    personalID: number;
    
    @IsString()
    nombreCompleto: string;

    @IsString()
    telefono: string;

    @IsString()
    direccion: string;

    @IsNumber()
    cargoID: number;
    
    @IsNumber()
    profesionID: number;

    @IsNotEmpty()
    @IsString()
    JWT: string;
}
