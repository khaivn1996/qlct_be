import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    // Single query with transaction data for balance calculation
    const wallets = await this.prisma.wallet.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      include: {
        transactions: {
          select: {
            type: true,
            amount: true,
          },
        },
      },
    });

    // Calculate balance from included transactions (no N+1)
    return wallets.map((wallet) => {
      let balance = BigInt(0);
      for (const txn of wallet.transactions) {
        if (txn.type === "INCOME") {
          balance += txn.amount;
        } else {
          balance -= txn.amount;
        }
      }

      // Remove transactions from response, keep only balance
      const { transactions: _, ...walletData } = wallet;
      return {
        ...walletData,
        balance: balance.toString(),
      };
    });
  }

  async findOne(userId: string, walletId: string) {
    const wallet = await this.prisma.wallet.findFirst({
      where: { id: walletId, userId },
      include: {
        transactions: {
          select: {
            type: true,
            amount: true,
          },
        },
      },
    });

    if (!wallet) return null;

    let balance = BigInt(0);
    for (const txn of wallet.transactions) {
      if (txn.type === "INCOME") {
        balance += txn.amount;
      } else {
        balance -= txn.amount;
      }
    }

    const { transactions: _, ...walletData } = wallet;
    return {
      ...walletData,
      balance: balance.toString(),
    };
  }
}
