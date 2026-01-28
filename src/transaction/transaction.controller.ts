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
} from "@nestjs/swagger";
import { TransactionService } from "./transaction.service";
import {
  CreateTransactionDto,
  UpdateTransactionDto,
  TransactionQueryDto,
} from "./dto";
import { JwtAuthGuard } from "../common/guards";
import { CurrentUser } from "../common/decorators";

@ApiTags("Transactions")
@Controller("transactions")
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  @Get()
  @ApiOperation({ summary: "Get transactions within date range" })
  @ApiResponse({ status: 200, description: "List of transactions" })
  async findAll(
    @CurrentUser() user: { sub: string },
    @Query() query: TransactionQueryDto,
  ) {
    return this.transactionService.findAll(user.sub, query);
  }

  @Post()
  @ApiOperation({ summary: "Create a new transaction" })
  @ApiResponse({ status: 201, description: "Transaction created" })
  async create(
    @CurrentUser() user: { sub: string },
    @Body() dto: CreateTransactionDto,
  ) {
    return this.transactionService.create(user.sub, dto);
  }

  @Put(":id")
  @ApiOperation({ summary: "Update a transaction" })
  @ApiResponse({ status: 200, description: "Transaction updated" })
  async update(
    @CurrentUser() user: { sub: string },
    @Param("id") id: string,
    @Body() dto: UpdateTransactionDto,
  ) {
    return this.transactionService.update(user.sub, id, dto);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a transaction" })
  @ApiResponse({ status: 200, description: "Transaction deleted" })
  async delete(@CurrentUser() user: { sub: string }, @Param("id") id: string) {
    return this.transactionService.delete(user.sub, id);
  }
}
