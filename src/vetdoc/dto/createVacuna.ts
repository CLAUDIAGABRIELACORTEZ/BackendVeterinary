import { IsNotEmpty, IsNumber, IsString } from "class-validator"


export class CreateVacunaDto {
    @IsNotEmpty()
    @IsString()
    NombreVacuna: string;

    @IsNotEmpty()
    @IsString()
    Descripcion: string;

    @IsNotEmpty()
    @IsString()
    Laboratorio: string;

    @IsNotEmpty()
    @IsNumber()
    EdadMinima: number;
}