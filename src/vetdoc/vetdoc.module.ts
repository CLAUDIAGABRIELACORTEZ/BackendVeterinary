import { Module } from '@nestjs/common';
import { VetdocController } from './vetdoc.controller';
import { VetdocService } from './vetdoc.service';


@Module({
    controllers: [VetdocController],
    providers: [VetdocService]
})
export class VetdocModule {}
