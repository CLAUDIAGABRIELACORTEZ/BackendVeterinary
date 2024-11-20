import { Transform } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber } from "class-validator";


export class CreateRegvacDto {
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    FechaVacunacion: Date;
    
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    ProximaFecha: Date;
    
    @IsNotEmpty()
    @IsNumber()
    VacunaID: number;
    
    @IsNotEmpty()
    @IsNumber()
    MascotaID: number;
}
