import { ConfigService } from "@nestjs/config";
import { NodemailService } from "./nodemail.service";

import { Module, LoggerService } from "@nestjs/common";

@Module({
    imports: [],
    controllers: [],
    providers: [NodemailService, ConfigService],
    exports: [NodemailService],
})
export class NodemailModule {}
