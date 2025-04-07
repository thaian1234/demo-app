import { PrismaService } from "src/prisma/prisma.service";
import { UserService } from "./user.service";

import { Module } from "@nestjs/common";

@Module({
    imports: [],
    controllers: [],
    providers: [UserService, PrismaService],
    exports: [UserService],
})
export class UserModule {}
