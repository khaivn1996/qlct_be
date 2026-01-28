import { TransactionService } from "./transaction.service";
import { CreateTransactionDto, UpdateTransactionDto, TransactionQueryDto } from "./dto";
export declare class TransactionController {
    private transactionService;
    constructor(transactionService: TransactionService);
    findAll(user: {
        sub: string;
    }, query: TransactionQueryDto): Promise<{
        amount: string;
        wallet: {
            name: string;
            id: string;
        };
        category: {
            name: string;
            type: string;
            id: string;
            icon: string;
        };
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        walletId: string;
        categoryId: string;
        note: string | null;
        txnDate: Date;
    }[]>;
    create(user: {
        sub: string;
    }, dto: CreateTransactionDto): Promise<{
        amount: string;
        category: {
            name: string;
            type: string;
            id: string;
            icon: string;
        };
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        walletId: string;
        categoryId: string;
        note: string | null;
        txnDate: Date;
    }>;
    update(user: {
        sub: string;
    }, id: string, dto: UpdateTransactionDto): Promise<{
        amount: string;
        category: {
            name: string;
            type: string;
            id: string;
            icon: string;
        };
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        walletId: string;
        categoryId: string;
        note: string | null;
        txnDate: Date;
    }>;
    delete(user: {
        sub: string;
    }, id: string): Promise<{
        message: string;
    }>;
}
