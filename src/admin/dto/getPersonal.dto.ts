import { IsNumber } from "class-validator";



export class GetPersonalDto {
    @IsNumber()
    cargoID?: number;
}