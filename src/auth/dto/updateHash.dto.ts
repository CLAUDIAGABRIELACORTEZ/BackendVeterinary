import { IsEmail, IsNotEmpty, IsString } from "class-validator";


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

// DTO para el caso de que el cambio de contraseña se haga dentro del perfil
// Es decir, el usuario primmero inicia sesión y luego hace el cambio de contraseña
// Falta de pulir y revisar si de verdad funcionaría, lo hará mi futuro Yo...
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
