import { IsNotEmpty, IsString } from "class-validator";


export class GetMascotasDto {
    @IsNotEmpty()
    @IsString()
    JWT: string;   
}
