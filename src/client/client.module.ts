import { Module } from '@nestjs/common';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { JwtStrategy } from 'src/auth/strategy';
import { JwtModule } from '@nestjs/jwt';


@Module({
    imports: [JwtModule.register({})],
    controllers: [ClientController],
    providers: [ClientService, JwtStrategy]
})
export class ClientModule {}
