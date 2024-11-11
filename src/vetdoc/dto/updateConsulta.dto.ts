import { IsNotEmpty, IsNumber } from "class-validator";


export class UpdateConsultaDto {
    @IsNumber()
    @IsNotEmpty()
    ServicioID: number;

    // @IsNumber()
    // @IsNotEmpty()
    // ConsultaID: number;
}
