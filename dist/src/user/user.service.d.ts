import { PrismaService } from "../prisma/prisma.service";
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    findById(id: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    findByEmail(email: string): Promise<{
        email: string;
        id: string;
        createdAt: Date;
        passwordHash: string;
        updatedAt: Date;
    } | null>;
}
