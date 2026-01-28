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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ReportService = class ReportService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMonthlyReport(userId, month) {
        const [year, monthNum] = month.split("-").map(Number);
        const startDate = new Date(year, monthNum - 1, 1);
        const endDate = new Date(year, monthNum, 0);
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
        let totalIncome = BigInt(0);
        let totalExpense = BigInt(0);
        const expenseByCategory = new Map();
        for (const txn of transactions) {
            if (txn.type === client_1.TransactionType.INCOME) {
                totalIncome += txn.amount;
            }
            else {
                totalExpense += txn.amount;
                const existing = expenseByCategory.get(txn.categoryId);
                if (existing) {
                    existing.total += txn.amount;
                }
                else {
                    expenseByCategory.set(txn.categoryId, {
                        name: txn.category.name,
                        icon: txn.category.icon,
                        total: txn.amount,
                    });
                }
            }
        }
        const expenseByCategoryArray = Array.from(expenseByCategory.entries()).map(([categoryId, data]) => ({
            categoryId,
            name: data.name,
            icon: data.icon,
            total: data.total.toString(),
        }));
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
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReportService);
//# sourceMappingURL=report.service.js.map