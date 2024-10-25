import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: [
            'https://javiercabrerac.github.io',
            'https://javiercabrerac.github.io/next-vet/',  // dominio en producción
            'http://localhost:3000'      //desarrollo local
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
      });
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true
    }));
    await app.listen(process.env.PORT, '0.0.0.0');
}
bootstrap();
