import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import { ValidationPipe } from "@nestjs/common/pipes/validation.pipe";
import { ConfigService } from "@nestjs/config";
import { ResponseInterceptor } from "./utils/interceptors/response.interceptor";
import { Reflector } from "@nestjs/core";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const port = app.get(ConfigService).get<number>("PORT", 4000);
    const reflector = app.get(Reflector);

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

bootstrap().catch(() => {
    Logger.error("Error starting the application");
});
