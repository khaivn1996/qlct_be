export declare class MonthlyReportQueryDto {
    month: string;
}
export declare class ExpenseByCategoryDto {
    categoryId: string;
    name: string;
    icon: string;
    total: string;
}
export declare class MonthlyReportResponseDto {
    totalIncome: string;
    totalExpense: string;
    balance: string;
    expenseByCategory: ExpenseByCategoryDto[];
}
