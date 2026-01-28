import { ReportService } from "./report.service";
import { MonthlyReportQueryDto } from "./dto";
export declare class ReportController {
    private reportService;
    constructor(reportService: ReportService);
    getMonthlyReport(user: {
        sub: string;
    }, query: MonthlyReportQueryDto): Promise<{
        totalIncome: string;
        totalExpense: string;
        balance: string;
        expenseByCategory: {
            categoryId: string;
            name: string;
            icon: string;
            total: string;
        }[];
    }>;
}
