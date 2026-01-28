import { PrismaService } from "../prisma/prisma.service";
export declare class ReportService {
    private prisma;
    constructor(prisma: PrismaService);
    getMonthlyReport(userId: string, month: string): Promise<{
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
