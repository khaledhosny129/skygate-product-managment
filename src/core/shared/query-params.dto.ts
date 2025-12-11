import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsIn,
  Min,
  Max
} from 'class-validator';
import { QueryOptions } from '@core/shared/query-options.interface';
import { ProductTypeEnum } from '@features/products/enums/product-type.enum';

export class QueryParamsDto implements QueryOptions {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @ApiProperty({ required: false, type: Number, example: 1, default: 1 })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  @ApiProperty({ required: false, type: Number, example: 10, default: 10 })
  limit?: number = 10;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, type: String, example: 'string' })
  search?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, type: String, example: 'string', default: 'createdAt' })
  sort?: string = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  @ApiProperty({ required: false, enum: ['asc', 'desc'], example: 'asc', default: 'desc' })
  order?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    example: 'Electronics',
    description: 'Filter by exact category name'
  })
  category?: string;

  @IsOptional()
  @IsIn(Object.values(ProductTypeEnum))
  @ApiProperty({
    required: false,
    enum: ProductTypeEnum,
    example: ProductTypeEnum.PUBLIC,
    description: 'Filter by type (public or private)'
  })
  type?: ProductTypeEnum;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({
    required: false,
    type: Number,
    example: 10,
    description: 'Minimum price filter'
  })
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @ApiProperty({
    required: false,
    type: Number,
    example: 100,
    description: 'Maximum price filter'
  })
  maxPrice?: number;
}

