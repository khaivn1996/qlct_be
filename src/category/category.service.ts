import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { TransactionType } from "../common/enums";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto";

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, type?: TransactionType) {
    return this.prisma.category.findMany({
      where: {
        userId,
        ...(type && { type }),
      },
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });
  }

  async create(userId: string, dto: CreateCategoryDto) {
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

  async update(userId: string, categoryId: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    if (category.userId !== userId) {
      throw new ForbiddenException("Cannot update category of another user");
    }

    return this.prisma.category.update({
      where: { id: categoryId },
      data: dto,
    });
  }

  async delete(userId: string, categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    if (category.userId !== userId) {
      throw new ForbiddenException("Cannot delete category of another user");
    }

    // Check if category has transactions
    const transactionCount = await this.prisma.transaction.count({
      where: { categoryId },
    });

    if (transactionCount > 0) {
      throw new ForbiddenException(
        `Cannot delete category with ${transactionCount} transactions. Delete transactions first.`,
      );
    }

    await this.prisma.category.delete({
      where: { id: categoryId },
    });

    return { message: "Category deleted successfully" };
  }
}
