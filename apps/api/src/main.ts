import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const port = app.get(ConfigService).get<number>('PORT', 4000);

    app.setGlobalPrefix('api');
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );

    await app.listen(port);
    Logger.log(`Application is running on: http://localhost:${port}/api`);
}

bootstrap().catch(() => {
    Logger.error('Error starting the application');
});
