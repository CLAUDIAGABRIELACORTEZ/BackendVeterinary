import { IsNotEmpty, IsString } from "class-validator";


export class CreateRazaDto {
    @IsString()
    @IsNotEmpty()
    NombreRaza: string;

    @IsNotEmpty()
    EspecieID: number;
}
