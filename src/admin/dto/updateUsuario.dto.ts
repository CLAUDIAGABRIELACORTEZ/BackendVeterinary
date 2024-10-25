import { IsNotEmpty, IsNumber } from "class-validator";


export class UpdateUsuarioDto {
    @IsNumber()
    @IsNotEmpty()
    UsuarioID: number;
}
