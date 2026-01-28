"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoryService = class CategoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId, type) {
        return this.prisma.category.findMany({
            where: {
                userId,
                ...(type && { type }),
            },
            orderBy: [{ type: "asc" }, { name: "asc" }],
        });
    }
    async create(userId, dto) {
        return this.prisma.category.create({
            data: {
                userId,
                name: dto.name,
                type: dto.type,
                icon: dto.icon,
                note: dto.note,
            },
        });
    }
    async update(userId, categoryId, dto) {
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException("Category not found");
        }
        if (category.userId !== userId) {
            throw new common_1.ForbiddenException("Cannot update category of another user");
        }
        return this.prisma.category.update({
            where: { id: categoryId },
            data: dto,
        });
    }
    async delete(userId, categoryId) {
        const category = await this.prisma.category.findUnique({
            where: { id: categoryId },
        });
        if (!category) {
            throw new common_1.NotFoundException("Category not found");
        }
        if (category.userId !== userId) {
            throw new common_1.ForbiddenException("Cannot delete category of another user");
        }
        const transactionCount = await this.prisma.transaction.count({
            where: { categoryId },
        });
        if (transactionCount > 0) {
            throw new common_1.ForbiddenException(`Cannot delete category with ${transactionCount} transactions. Delete transactions first.`);
        }
        await this.prisma.category.delete({
            where: { id: categoryId },
        });
        return { message: "Category deleted successfully" };
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoryService);
//# sourceMappingURL=category.service.js.map