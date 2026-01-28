import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsNumber,
  Min,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TransactionType } from "../../common/enums";
import { Type } from "class-transformer";

export class CreateTransactionDto {
  @ApiProperty()
  @IsString()
  walletId: string;

  @ApiProperty()
  @IsString()
  categoryId: string;

  @ApiProperty({ enum: TransactionType, example: "EXPENSE" })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: 100000, description: "Amount in VND (integer)" })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  amount: number;

  @ApiProperty({ example: "2026-01-24" })
  @IsDateString()
  txnDate: string;

  @ApiPropertyOptional({ example: "Lunch with friends" })
  @IsString()
  @IsOptional()
  note?: string;
}

export class UpdateTransactionDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ enum: TransactionType })
  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;

  @ApiPropertyOptional({ example: 100000 })
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  @IsOptional()
  amount?: number;

  @ApiPropertyOptional({ example: "2026-01-24" })
  @IsDateString()
  @IsOptional()
  txnDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  note?: string;
}

export class TransactionQueryDto {
  @ApiProperty({ example: "2026-01-01", description: "From date (YYYY-MM-DD)" })
  @IsDateString()
  from: string;

  @ApiProperty({ example: "2026-01-31", description: "To date (YYYY-MM-DD)" })
  @IsDateString()
  to: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  walletId?: string;
}
