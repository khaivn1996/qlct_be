import { PrismaService } from "../prisma/prisma.service";
export declare class WalletService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string): Promise<{
        balance: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        userId: string;
    }[]>;
    findOne(userId: string, walletId: string): Promise<{
        balance: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        userId: string;
    } | null>;
}
