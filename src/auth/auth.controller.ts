import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthLoginInDto } from "./dto";
import { JwtGuard, RolesGuard } from "./guard";
import { Role, Roles } from "./decorator";



@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')  // {{local}}/auth/login
    login(@Body() dto: AuthLoginInDto) {
        return this.authService.login(dto);
    }
    
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.CLIENT, Role.VETDOC)
    @Post('logout')  // {{local}}/auth/logout
    logout(@Request() req) {
        return this.authService.logout(req);
    }
}
