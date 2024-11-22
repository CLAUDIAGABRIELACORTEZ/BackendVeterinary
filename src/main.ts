import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: [
            'https://javiercabrerac.github.io',
            'https://front-veterinary.vercel.app',  // dominio en producción
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

    // Escuchar el puerto definido en process.env.PORT o usar 3000 como fallback
    const port = process.env.PORT || 3000;
    await app.listen(process.env.PORT, '0.0.0.0');
    // Imprimir el puerto en consola
    console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
