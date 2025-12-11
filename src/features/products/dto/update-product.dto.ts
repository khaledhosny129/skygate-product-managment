import { PartialType } from '@nestjs/swagger';

import { CreateProductDto } from '@features/products/dto/create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}

