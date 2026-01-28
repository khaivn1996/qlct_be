import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";

@Module({
  imports: [JwtModule.register({})],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
