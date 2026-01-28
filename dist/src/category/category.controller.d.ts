import { TransactionType } from "../common/enums";
import { CategoryService } from "./category.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto";
export declare class CategoryController {
    private categoryService;
    constructor(categoryService: CategoryService);
    findAll(user: {
        sub: string;
    }, type?: TransactionType): Promise<{
        name: string;
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        note: string | null;
        icon: string;
    }[]>;
    create(user: {
        sub: string;
    }, dto: CreateCategoryDto): Promise<{
        name: string;
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        note: string | null;
        icon: string;
    }>;
    update(user: {
        sub: string;
    }, id: string, dto: UpdateCategoryDto): Promise<{
        name: string;
        type: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        note: string | null;
        icon: string;
    }>;
    delete(user: {
        sub: string;
    }, id: string): Promise<{
        message: string;
    }>;
}
