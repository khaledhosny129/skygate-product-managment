import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
  MaxLength,
  MinLength,
  Matches,
  ValidateIf
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductTypeEnum } from '@features/products/enums/product-type.enum';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[A-Za-z0-9_-]+$/, {
    message: 'sku must be alphanumeric and can contain hyphens and underscores'
  })
  @ApiProperty({
    type: String,
    required: true,
    example: 'PROD-001',
    description: 'SKU must be alphanumeric, 3-50 characters, unique'
  })
  sku: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  @ApiProperty({
    type: String,
    required: true,
    example: 'Product Name',
    description: 'Product name, 3-200 characters'
  })
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  @ApiProperty({
    type: String,
    required: false,
    nullable: true,
    example: 'Product description',
    description: 'Product description, max 1000 characters',
    default: null
  })
  description?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  @ApiProperty({
    type: String,
    required: true,
    example: 'Electronics',
    description: 'Product category, 2-100 characters'
  })
  category: string;

  @IsEnum(ProductTypeEnum)
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    enum: ProductTypeEnum,
    example: ProductTypeEnum.PUBLIC,
    description: 'Product type: public or private',
    default: ProductTypeEnum.PUBLIC
  })
  type: ProductTypeEnum;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(0.01, { message: 'price must be greater than 0' })
  @ApiProperty({
    type: Number,
    required: true,
    example: 99.99,
    description: 'Product price, must be > 0, max 2 decimal places'
  })
  price: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @IsOptional()
  @Min(0, { message: 'discountPrice must be >= 0' })
  @ValidateIf(o => o.discountPrice !== null && o.discountPrice !== undefined)
  @ApiProperty({
    type: Number,
    required: false,
    nullable: true,
    example: 79.99,
    description: 'Discount price, must be >= 0',
    default: null
  })
  discountPrice?: number;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  @Min(0, { message: 'quantity must be >= 0' })
  @ApiProperty({
    type: Number,
    required: true,
    example: 100,
    description: 'Product quantity, must be >= 0',
    default: 0
  })
  quantity: number;
}

