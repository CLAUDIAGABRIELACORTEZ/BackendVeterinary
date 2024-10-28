import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ClientModule } from './client/client.module';
import { VetdocModule } from './vetdoc/vetdoc.module';
import { ExampleModule } from './example/example.module';
import { AppController } from './app.controller';


@Module({
    imports: [
            ConfigModule.forRoot({ isGlobal: true }), 
            PrismaModule, 
            AuthModule,
            ExampleModule,
            AdminModule,
            ClientModule,
            VetdocModule],
    controllers: [ AppController ],
    providers: [ AppService ],
})
export class AppModule {}
