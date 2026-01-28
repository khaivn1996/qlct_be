import { PrismaService } from "../prisma/prisma.service";
import { CreateTransactionDto, UpdateTransactionDto, TransactionQueryDto } from "./dto";
export declare class TransactionService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string, query: TransactionQueryDto): Promise<{
        amount: string;
        wallet: {
            name: string;
            id: string;
        };
        category: {
            name: string;
            type: import("@prisma/client").$Enums.TransactionType;
            id: string;
            icon: string;
        };
        type: import("@prisma/client").$Enums.TransactionType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        walletId: string;
        categoryId: string;
        note: string | null;
        txnDate: Date;
    }[]>;
    create(userId: string, dto: CreateTransactionDto): Promise<{
        amount: string;
        category: {
            name: string;
            type: import("@prisma/client").$Enums.TransactionType;
            id: string;
            icon: string;
        };
        type: import("@prisma/client").$Enums.TransactionType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        walletId: string;
        categoryId: string;
        note: string | null;
        txnDate: Date;
    }>;
    update(userId: string, transactionId: string, dto: UpdateTransactionDto): Promise<{
        amount: string;
        category: {
            name: string;
            type: import("@prisma/client").$Enums.TransactionType;
            id: string;
            icon: string;
        };
        type: import("@prisma/client").$Enums.TransactionType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        walletId: string;
        categoryId: string;
        note: string | null;
        txnDate: Date;
    }>;
    delete(userId: string, transactionId: string): Promise<{
        message: string;
    }>;
}
