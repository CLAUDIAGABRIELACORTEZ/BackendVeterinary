import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtStrategy } from 'src/auth/strategy';



@Module({
    imports: [JwtModule.register({})],
    controllers: [AdminController],
    providers: [AdminService, JwtStrategy]
})
export class AdminModule {}
