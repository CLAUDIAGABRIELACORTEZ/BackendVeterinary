import { IsDate, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Transform } from "class-transformer";



export class CreateMascotaDto {
    @IsString()
    @IsNotEmpty()
    Nombre: string;
    
    @IsString()
    @IsNotEmpty()
    Sexo: string;

    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    FechaDeNacimiento: Date

    @IsString()
    @IsNotEmpty()
    Observaciones: string;

    @IsNotEmpty()
    @IsNumber()
    ClienteID: number;

    @IsNotEmpty()
    @IsNumber()
    RazaID: number;
}
