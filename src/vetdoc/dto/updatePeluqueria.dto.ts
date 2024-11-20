import { IsNotEmpty, IsNumber } from "class-validator";


export class UpdatePeluqeriaDto {
    @IsNumber()
    @IsNotEmpty()
    ServicioID: number;
}
