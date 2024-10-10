import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Transform } from "class-transformer";



export class UpdateMascotaDto {
    @IsNumber()
    @IsNotEmpty()
    mascotaID: number;
    
    @IsString()
    Nombre: string;
    
    @IsString()
    Sexo: string;

    @IsDate()
    @Transform(({ value }) => new Date(value))
    FechaDeNacimiento: Date

    @IsString()
    Observaciones: string;

    @IsNotEmpty()
    @IsString()
    JWT: string;
}