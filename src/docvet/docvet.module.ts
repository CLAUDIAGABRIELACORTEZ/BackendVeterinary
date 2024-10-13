import { Module } from '@nestjs/common';
import { DocvetController } from './docvet.controller';
import { DocvetService } from './docvet.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from 'src/auth/strategy';



@Module({
    imports: [JwtModule.register({})],
    controllers: [DocvetController],
    providers: [DocvetService, JwtStrategy],
})
export class DocvetModule {}
