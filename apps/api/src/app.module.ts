import { AuthModule } from "./auth/auth.module";
import { PrismaService } from "./prisma/prisma.service";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        AuthModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
    controllers: [],
    providers: [PrismaService],
})
export class AppModule {}
