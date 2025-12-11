import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseService } from '@core/shared/base.service';
import { Product, ProductDoc } from '@features/products/entities/product.entity';

@Injectable()
export class ProductsService extends BaseService<ProductDoc> {
  constructor(
    @InjectModel(Product.name)
    private readonly m: Model<ProductDoc>
  ) {
    super(m);
  }
}

