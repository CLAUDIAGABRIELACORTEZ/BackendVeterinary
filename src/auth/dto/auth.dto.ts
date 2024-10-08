import { IsEmail, IsNotEmpty, IsString } from "class-validator";



export class AuthLoginInDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    password: string;
}
