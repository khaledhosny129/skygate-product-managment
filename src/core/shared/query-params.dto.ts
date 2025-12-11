import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsIn,
  IsObject,
  Min,
  Max
} from 'class-validator';
import { QueryOptions } from '@core/shared/query-options.interface';

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
  @IsObject()
  @Type(() => Object)
  @ApiProperty({ 
    required: false, 
    type: Object, 
    example: { category: 'string', status: 'string' },
    description: 'Filter by field-value pairs. Supports min/max prefixes for range queries (e.g., minPrice, maxPrice)'
  })
  filterBy?: Record<string, any>;
}

