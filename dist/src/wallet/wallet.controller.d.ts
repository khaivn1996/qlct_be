import { WalletService } from "./wallet.service";
export declare class WalletController {
    private walletService;
    constructor(walletService: WalletService);
    findAll(user: {
        sub: string;
    }): Promise<{
        balance: string;
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        userId: string;
    }[]>;
}
