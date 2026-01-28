import { IsString, IsEnum, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { TransactionType } from "../../common/enums";

export class CreateCategoryDto {
  @ApiProperty({ example: "Ăn uống" })
  @IsString()
  name: string;

  @ApiProperty({ enum: TransactionType, example: "EXPENSE" })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: "Bowl" })
  @IsString()
  icon: string;

  @ApiPropertyOptional({ example: "Ghi chú cho danh mục" })
  @IsString()
  @IsOptional()
  note?: string;
}

export class UpdateCategoryDto {
  @ApiPropertyOptional({ example: "Ăn uống" })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ example: "Bowl" })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ example: "Ghi chú cho danh mục" })
  @IsString()
  @IsOptional()
  note?: string;
}

export class CategoryQueryDto {
  @ApiPropertyOptional({ enum: TransactionType })
  @IsEnum(TransactionType)
  @IsOptional()
  type?: TransactionType;
}
