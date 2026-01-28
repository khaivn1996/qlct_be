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
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TransactionService = class TransactionService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId, query) {
        const { from, to, walletId } = query;
        const transactions = await this.prisma.transaction.findMany({
            where: {
                userId,
                txnDate: {
                    gte: new Date(from),
                    lte: new Date(to),
                },
                ...(walletId && { walletId }),
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        icon: true,
                        type: true,
                    },
                },
                wallet: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: [{ txnDate: "desc" }, { createdAt: "desc" }],
        });
        return transactions.map((txn) => ({
            ...txn,
            amount: txn.amount.toString(),
        }));
    }
    async create(userId, dto) {
        const wallet = await this.prisma.wallet.findFirst({
            where: { id: dto.walletId, userId },
        });
        if (!wallet) {
            throw new common_1.ForbiddenException("Wallet not found or not owned by user");
        }
        const category = await this.prisma.category.findFirst({
            where: { id: dto.categoryId, userId },
        });
        if (!category) {
            throw new common_1.ForbiddenException("Category not found or not owned by user");
        }
        const transaction = await this.prisma.transaction.create({
            data: {
                userId,
                walletId: dto.walletId,
                categoryId: dto.categoryId,
                type: dto.type,
                amount: BigInt(dto.amount),
                txnDate: new Date(dto.txnDate),
                note: dto.note,
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        icon: true,
                        type: true,
                    },
                },
            },
        });
        return {
            ...transaction,
            amount: transaction.amount.toString(),
        };
    }
    async update(userId, transactionId, dto) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
        });
        if (!transaction) {
            throw new common_1.NotFoundException("Transaction not found");
        }
        if (transaction.userId !== userId) {
            throw new common_1.ForbiddenException("Cannot update transaction of another user");
        }
        if (dto.categoryId) {
            const category = await this.prisma.category.findFirst({
                where: { id: dto.categoryId, userId },
            });
            if (!category) {
                throw new common_1.ForbiddenException("Category not found or not owned by user");
            }
        }
        const updated = await this.prisma.transaction.update({
            where: { id: transactionId },
            data: {
                ...(dto.categoryId && { categoryId: dto.categoryId }),
                ...(dto.type && { type: dto.type }),
                ...(dto.amount && { amount: BigInt(dto.amount) }),
                ...(dto.txnDate && { txnDate: new Date(dto.txnDate) }),
                ...(dto.note !== undefined && { note: dto.note }),
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        icon: true,
                        type: true,
                    },
                },
            },
        });
        return {
            ...updated,
            amount: updated.amount.toString(),
        };
    }
    async delete(userId, transactionId) {
        const transaction = await this.prisma.transaction.findUnique({
            where: { id: transactionId },
        });
        if (!transaction) {
            throw new common_1.NotFoundException("Transaction not found");
        }
        if (transaction.userId !== userId) {
            throw new common_1.ForbiddenException("Cannot delete transaction of another user");
        }
        await this.prisma.transaction.delete({
            where: { id: transactionId },
        });
        return { message: "Transaction deleted successfully" };
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionService);
//# sourceMappingURL=transaction.service.js.map