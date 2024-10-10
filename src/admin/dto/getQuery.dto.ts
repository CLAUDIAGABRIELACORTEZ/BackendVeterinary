import { IsNotEmpty, IsString } from "class-validator";



export class GetQueryDto {
    @IsString()
    @IsNotEmpty()
    JWT: string;
}