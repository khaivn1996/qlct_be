"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const report_service_1 = require("./report.service");
const dto_1 = require("./dto");
const guards_1 = require("../common/guards");
const decorators_1 = require("../common/decorators");
let ReportController = class ReportController {
    constructor(reportService) {
        this.reportService = reportService;
    }
    async getMonthlyReport(user, query) {
        return this.reportService.getMonthlyReport(user.sub, query.month);
    }
};
exports.ReportController = ReportController;
__decorate([
    (0, common_1.Get)("monthly"),
    (0, swagger_1.ApiOperation)({ summary: "Get monthly report with expense breakdown" }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: "Monthly report",
        type: dto_1.MonthlyReportResponseDto,
    }),
    __param(0, (0, decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.MonthlyReportQueryDto]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getMonthlyReport", null);
exports.ReportController = ReportController = __decorate([
    (0, swagger_1.ApiTags)("Reports"),
    (0, common_1.Controller)("reports"),
    (0, common_1.UseGuards)(guards_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [report_service_1.ReportService])
], ReportController);
//# sourceMappingURL=report.controller.js.map