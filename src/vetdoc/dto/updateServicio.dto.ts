import { IsNotEmpty, IsNumber } from "class-validator";


export class UpdateServicioDto {
    @IsNumber()
    @IsNotEmpty()
    ServicioID: number;
}
