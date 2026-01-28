import { IsString, Matches } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class MonthlyReportQueryDto {
  @ApiProperty({ example: "2026-01", description: "Month in YYYY-MM format" })
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, { message: "Month must be in YYYY-MM format" })
  month: string;
}

export class ExpenseByCategoryDto {
  categoryId: string;
  name: string;
  icon: string;
  total: string;
}

export class MonthlyReportResponseDto {
  totalIncome: string;
  totalExpense: string;
  balance: string;
  expenseByCategory: ExpenseByCategoryDto[];
}
