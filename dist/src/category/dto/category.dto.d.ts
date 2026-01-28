import { TransactionType } from "../../common/enums";
export declare class CreateCategoryDto {
    name: string;
    type: TransactionType;
    icon: string;
    note?: string;
}
export declare class UpdateCategoryDto {
    name?: string;
    icon?: string;
    note?: string;
}
export declare class CategoryQueryDto {
    type?: TransactionType;
}
