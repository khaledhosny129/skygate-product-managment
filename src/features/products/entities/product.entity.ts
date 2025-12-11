import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { BaseEntity } from '@core/entities/base.entity';
import { ProductTypeEnum } from '@features/products/enums/product-type.enum';

export type ProductDoc = Product & Document;

@Schema({ timestamps: true, id: true, versionKey: false })
export class Product extends BaseEntity {
  @Prop({
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
    maxlength: 50
  })
  sku: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 200
  })
  name: string;

  @Prop({
    type: String,
    required: false,
    default: null,
    maxlength: 1000
  })
  description?: string;

  @Prop({
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  })
  category: string;

  @Prop({
    type: String,
    enum: Object.values(ProductTypeEnum),
    required: true,
    default: ProductTypeEnum.PUBLIC
  })
  type: ProductTypeEnum;

  @Prop({
    type: Number,
    required: true,
    min: 0.01,
    set: (value: number) => Math.trunc(value * 100) / 100
  })
  price: number;

  @Prop({
    type: Number,
    required: false,
    default: null,
    min: 0,
    set: (value: number) => value !== null && value !== undefined ? Math.trunc(value * 100) / 100 : null
  })
  discountPrice?: number;

  @Prop({
    type: Number,
    required: true,
    min: 0,
    default: 0
  })
  quantity: number;
}

export const productSchema = SchemaFactory.createForClass(Product);
