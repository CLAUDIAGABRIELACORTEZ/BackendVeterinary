import { Body, Controller, HttpCode, HttpStatus, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { Request } from 'express';
import { AuthService } from "./auth.service";
import { JwtGuard, RolesGuard } from "./guard";
import { Role, Roles, Usuario } from "./decorator";
import { AuthLoginInDto, UpdateHashDto } from "./dto";


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login') // {{local}}/auth/login
    login(@Body() dto: AuthLoginInDto, @Req() req: Request) {
        const ipDir = req.ip || req.connection.remoteAddress;
        return this.authService.login(dto, ipDir);
    }
    
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.CLIENT, Role.VETDOC)
    @Post('logout') // {{local}}/auth/logout
    logout(@Usuario() { userId, ip }: { userId: number, ip: string }) {
        return this.authService.logout(userId, ip);
    }

    @HttpCode(HttpStatus.OK)
    @Patch('updateHash') // {{local}}/auth/updateHash
    async updateHash(@Body() dto: UpdateHashDto) {
        return await this.authService.updateHash(dto);
    }

    // @HttpCode(HttpStatus.OK)
    // @UseGuards(JwtGuard, RolesGuard)
    // @Roles(Role.ADMIN, Role.CLIENT, Role.VETDOC)
    // @Patch('updateHash')
    // async updateHash(@Body() dto: UpdateHashDto) {
    //     return await this.authService.updateHash(dto);
    // }
}
