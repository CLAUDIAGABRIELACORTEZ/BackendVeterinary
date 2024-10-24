import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";


export class UpdateMascotaDto {
    @IsNumber()
    @IsNotEmpty()
    ID: number;
    
    @IsString()
    @IsOptional()
    Nombre?: string;
    
    @IsString()
    @IsOptional()
    Sexo?: string;
    
    @IsString()
    @IsOptional()
    Observaciones?: string;

    @IsString()
    @IsOptional()
    ClienteID?: string;
}
