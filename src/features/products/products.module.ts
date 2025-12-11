import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Product, productSchema } from '@features/products/entities/product.entity';
import { ProductsController } from '@features/products/products.controller';
import { ProductsService } from '@features/products/products.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: productSchema }])
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService]
})
export class ProductsModule {}

