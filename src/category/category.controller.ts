import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiQuery,
} from "@nestjs/swagger";
import { TransactionType } from "@prisma/client";
import { CategoryService } from "./category.service";
import { CreateCategoryDto, UpdateCategoryDto } from "./dto";
import { JwtAuthGuard } from "../common/guards";
import { CurrentUser } from "../common/decorators";

@ApiTags("Categories")
@Controller("categories")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: "Get all categories for current user" })
  @ApiQuery({ name: "type", enum: TransactionType, required: false })
  @ApiResponse({ status: 200, description: "List of categories" })
  async findAll(
    @CurrentUser() user: { sub: string },
    @Query("type") type?: TransactionType,
  ) {
    return this.categoryService.findAll(user.sub, type);
  }

  @Post()
  @ApiOperation({ summary: "Create a new category" })
  @ApiResponse({ status: 201, description: "Category created" })
  async create(
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateCategoryDto,
  ) {
    return this.categoryService.create(user.sub, dto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a category" })
  @ApiResponse({ status: 200, description: "Category updated" })
  async update(
    @CurrentUser() user: { sub: string },
    @Param("id") id: string,
    @Body() dto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(user.sub, id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a category" })
  @ApiResponse({ status: 200, description: "Category deleted" })
  async delete(@CurrentUser() user: { sub: string }, @Param("id") id: string) {
    return this.categoryService.delete(user.sub, id);
  }
}
