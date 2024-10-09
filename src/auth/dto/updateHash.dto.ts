import { IsEmail, IsNotEmpty, IsString } from "class-validator";



// export class UpdateHashDto {
//     @IsNotEmpty()
//     @IsString()
//     JWT: string;
    
//     @IsNotEmpty()
//     @IsString()
//     hashActual: string;
    
//     @IsNotEmpty()
//     @IsString()
//     hashNuevo: string;
// }

// Dto para la segunda versión
export class UpdateHashDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;
    
    @IsNotEmpty()
    @IsString()
    hashActual: string;
    
    @IsNotEmpty()
    @IsString()
    hashNuevo: string;
}