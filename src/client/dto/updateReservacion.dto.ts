import { IsNotEmpty, IsNumber } from "class-validator";


export class UpdateReservacionDto {
    @IsNumber()
    @IsNotEmpty()
    ReservacionID: number;
}
