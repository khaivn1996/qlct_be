import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from "@nestjs/swagger";
import { ReportService } from "./report.service";
import { MonthlyReportQueryDto, MonthlyReportResponseDto } from "./dto";
import { JwtAuthGuard } from "../common/guards";
import { CurrentUser } from "../common/decorators";

@ApiTags("Reports")
@Controller("reports")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReportController {
  constructor(private reportService: ReportService) {}

  @Get("monthly")
  @ApiOperation({ summary: "Get monthly report with expense breakdown" })
  @ApiResponse({
    status: 200,
    description: "Monthly report",
    type: MonthlyReportResponseDto,
  })
  async getMonthlyReport(
    @CurrentUser() user: { sub: string },
    @Query() query: MonthlyReportQueryDto,
  ) {
    return this.reportService.getMonthlyReport(user.sub, query.month);
  }
}
