import { IsNotEmpty, IsString } from "class-validator";



export class UpdateHashDto {
    @IsNotEmpty()
    @IsString()
    JWT: string;
    
    @IsNotEmpty()
    @IsString()
    hashActual: string;
    
    @IsNotEmpty()
    @IsString()
    hashNuevo: string;
}