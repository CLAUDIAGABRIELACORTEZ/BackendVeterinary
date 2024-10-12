import { IsNotEmpty, IsNumber, IsString } from "class-validator";



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
}
