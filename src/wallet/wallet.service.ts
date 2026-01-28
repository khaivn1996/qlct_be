import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string) {
    const wallets = await this.prisma.wallet.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    // Calculate balance for each wallet
    const walletsWithBalance = await Promise.all(
      wallets.map(async (wallet) => {
        const transactions = await this.prisma.transaction.findMany({
          where: { walletId: wallet.id },
        });

        let balance = BigInt(0);
        for (const txn of transactions) {
          if (txn.type === "INCOME") {
            balance += txn.amount;
          } else {
            balance -= txn.amount;
          }
        }

        return {
          ...wallet,
          balance: balance.toString(),
        };
      }),
    );

    return walletsWithBalance;
  }

  async findOne(userId: string, walletId: string) {
    const wallet = await this.prisma.wallet.findFirst({
      where: { id: walletId, userId },
    });

    if (!wallet) return null;

    const transactions = await this.prisma.transaction.findMany({
      where: { walletId: wallet.id },
    });

    let balance = BigInt(0);
    for (const txn of transactions) {
      if (txn.type === "INCOME") {
        balance += txn.amount;
      } else {
        balance -= txn.amount;
      }
    }

    return {
      ...wallet,
      balance: balance.toString(),
    };
  }
}
