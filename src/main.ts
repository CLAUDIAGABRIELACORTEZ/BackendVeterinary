process.env.TZ = 'America/La_Paz';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';



async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: '*', // Aquí puedes especificar el dominio del frontend en lugar de '*'
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
      });
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true
    }));
    await app.listen(3333);
}
bootstrap();
