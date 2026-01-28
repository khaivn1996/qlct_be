import { TransactionType } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto";
export declare class CategoryService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string, type?: TransactionType): Promise<{
        name: string;
        type: import("@prisma/client").$Enums.TransactionType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        note: string | null;
        icon: string;
    }[]>;
    create(userId: string, dto: CreateCategoryDto): Promise<{
        name: string;
        type: import("@prisma/client").$Enums.TransactionType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        note: string | null;
        icon: string;
    }>;
    update(userId: string, categoryId: string, dto: UpdateCategoryDto): Promise<{
        name: string;
        type: import("@prisma/client").$Enums.TransactionType;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        note: string | null;
        icon: string;
    }>;
    delete(userId: string, categoryId: string): Promise<{
        message: string;
    }>;
}
