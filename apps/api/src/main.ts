import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common/pipes/validation.pipe";
import { ConfigService } from "@nestjs/config";
import { ResponseInterceptor } from "./utils/interceptors/response.interceptor";
import { Reflector } from "@nestjs/core";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const reflector = app.get(Reflector);

    const port = configService.get<number>("PORT", 4000);
    const frontendUrl = configService.get<string>("FRONTEND_URL", "http://localhost:5173");

    app.enableCors({
        origin: frontendUrl,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization", "Accept"],
        exposedHeaders: ["Content-Disposition"],
    });
    app.setGlobalPrefix("api");
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );
    app.useGlobalInterceptors(new ResponseInterceptor(reflector));

    await app.listen(port);
    Logger.log(`Application is running on: http://localhost:${port}/api`);
}

bootstrap().catch(err => {
    Logger.error("Error starting the application", err);
});
