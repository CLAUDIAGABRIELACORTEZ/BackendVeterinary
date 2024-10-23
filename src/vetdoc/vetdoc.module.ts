import { Module } from '@nestjs/common';
import { VetdocController } from './vetdoc.controller';
import { VetdocService } from './vetdoc.service';
import { JwtModule } from '@nestjs/jwt';


@Module({
    imports: [JwtModule.register({})],
    controllers: [VetdocController],
    providers: [VetdocService]
})
export class VetdocModule {}
