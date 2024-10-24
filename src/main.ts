import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: '*', // Aquí puedes especificar el dominio del frontend en lugar de '*'
        methods: 'GET,HEAD,PUT,PATCH,POST',
        credentials: true,
      });
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true
    }));
    await app.listen(process.env.PORT, '0.0.0.0');
}
bootstrap();
