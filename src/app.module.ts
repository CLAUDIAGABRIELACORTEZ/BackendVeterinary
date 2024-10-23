import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ExampleModule } from './example/example.module';
import { AdminModule } from './admin/admin.module';
import { ClientModule } from './client/client.module';
import { DocvetModule } from './docvet/docvet.module';
import { VetdocModule } from './vetdoc/vetdoc.module';



@Module({
    imports: [
            ConfigModule.forRoot({ isGlobal: true }), 
            PrismaModule, 
            AuthModule,
            ExampleModule,
            AdminModule,
            ClientModule,
            DocvetModule,
            VetdocModule],
    controllers: [ AppController ],
    providers: [ AppService ],
})
export class AppModule {}
