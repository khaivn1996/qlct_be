import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionQueryDto,
} from "./dto";

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, query: TransactionQueryDto) {
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

    // Convert BigInt to string for JSON serialization
    return transactions.map((txn) => ({
      ...txn,
      amount: txn.amount.toString(),
    }));
  }

  async create(userId: string, dto: CreateTransactionDto) {
    // Verify wallet belongs to user
    const wallet = await this.prisma.wallet.findFirst({
      where: { id: dto.walletId, userId },
    });

    if (!wallet) {
      throw new ForbiddenException("Wallet not found or not owned by user");
    }

    // Verify category belongs to user
    const category = await this.prisma.category.findFirst({
      where: { id: dto.categoryId, userId },
    });

    if (!category) {
      throw new ForbiddenException("Category not found or not owned by user");
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

  async update(
    userId: string,
    transactionId: string,
    dto: UpdateTransactionDto,
  ) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new NotFoundException("Transaction not found");
    }

    if (transaction.userId !== userId) {
      throw new ForbiddenException("Cannot update transaction of another user");
    }

    // If updating category, verify it belongs to user
    if (dto.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: { id: dto.categoryId, userId },
      });

      if (!category) {
        throw new ForbiddenException("Category not found or not owned by user");
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

  async delete(userId: string, transactionId: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new NotFoundException("Transaction not found");
    }

    if (transaction.userId !== userId) {
      throw new ForbiddenException("Cannot delete transaction of another user");
    }

    await this.prisma.transaction.delete({
      where: { id: transactionId },
    });

    return { message: "Transaction deleted successfully" };
  }
}
