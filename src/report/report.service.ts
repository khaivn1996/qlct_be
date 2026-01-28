import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { TransactionType } from "../common/enums";

@Injectable()
export class ReportService {
  constructor(private prisma: PrismaService) {}

  async getMonthlyReport(userId: string, month: string) {
    // Parse month string (YYYY-MM)
    const [year, monthNum] = month.split("-").map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0); // Last day of month

    // Get all transactions for the month
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        txnDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
          },
        },
      },
    });

    // Calculate totals
    let totalIncome = BigInt(0);
    let totalExpense = BigInt(0);
    const expenseByCategory: Map<
      string,
      { name: string; icon: string; total: bigint }
    > = new Map();

    for (const txn of transactions) {
      if (txn.type === TransactionType.INCOME) {
        totalIncome += txn.amount;
      } else {
        totalExpense += txn.amount;

        // Aggregate expenses by category
        const existing = expenseByCategory.get(txn.categoryId);
        if (existing) {
          existing.total += txn.amount;
        } else {
          expenseByCategory.set(txn.categoryId, {
            name: txn.category.name,
            icon: txn.category.icon,
            total: txn.amount,
          });
        }
      }
    }

    // Convert expense map to array
    const expenseByCategoryArray = Array.from(expenseByCategory.entries()).map(
      ([categoryId, data]) => ({
        categoryId,
        name: data.name,
        icon: data.icon,
        total: data.total.toString(),
      }),
    );

    // Sort by total descending
    expenseByCategoryArray.sort((a, b) => {
      return BigInt(b.total) > BigInt(a.total) ? 1 : -1;
    });

    return {
      totalIncome: totalIncome.toString(),
      totalExpense: totalExpense.toString(),
      balance: (totalIncome - totalExpense).toString(),
      expenseByCategory: expenseByCategoryArray,
    };
  }
}
