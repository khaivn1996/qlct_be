import { TransactionType } from "@prisma/client";
export declare class CreateTransactionDto {
    walletId: string;
    categoryId: string;
    type: TransactionType;
    amount: number;
    txnDate: string;
    note?: string;
}
export declare class UpdateTransactionDto {
    categoryId?: string;
    type?: TransactionType;
    amount?: number;
    txnDate?: string;
    note?: string;
}
export declare class TransactionQueryDto {
    from: string;
    to: string;
    walletId?: string;
}
