import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from 'mongoose';

import { BadRequestException, NotFoundException } from '@core/exceptions';
import { BaseService } from '@core/shared/base.service';
import { QueryOptions } from '@core/shared/query-options.interface';
import { CreateProductDto } from '@features/products/dto/create-product.dto';
import { UpdateProductDto } from '@features/products/dto/update-product.dto';
import { Product, ProductDoc } from '@features/products/entities/product.entity';
import { ProductTypeEnum } from '@features/products/enums/product-type.enum';
import { RoleEnum } from '@features/users/enums/role.enum';
import { RequestWithUser } from '@core/interfaces/user-request.interface';

@Injectable()
export class ProductsService extends BaseService<ProductDoc> {
  constructor(
    @InjectModel(Product.name)
    private readonly m: Model<ProductDoc>
  ) {
    super(m);
  }

  async createProduct(createProductDto: CreateProductDto) {
    if (createProductDto.discountPrice !== null && createProductDto.discountPrice !== undefined) {
      if (createProductDto.discountPrice >= createProductDto.price) {
        throw new BadRequestException(
          'discountPrice must be less than price',
          {
            code: 'INVALID_DISCOUNT_PRICE',
            details: {
              discountPrice: createProductDto.discountPrice,
              price: createProductDto.price
            }
          }
        );
      }
    }

    const product = await this.create(createProductDto);
    return {
      message: 'Product created successfully',
      data: product
    };
  }

  async findAll(
    filter: any = {},
    projection: any = {},
    req: RequestWithUser,
    queryOptions?: QueryOptions
  ) {
    const queryFilter = { ...filter };

    if (req.user.role !== RoleEnum.SUPER_ADMIN) {
      queryFilter.type = ProductTypeEnum.PUBLIC;
    }

    if (queryOptions?.filterBy) {
      const filterBy = queryOptions.filterBy;
      if (filterBy.category) {
        queryFilter.category = filterBy.category;
      }
      if (filterBy.type && req.user.role === RoleEnum.SUPER_ADMIN) {
        queryFilter.type = filterBy.type;
      }
    }

    const result = await this.find(queryFilter, projection, {
      ...queryOptions,
      searchFields: ['name', 'sku', 'category', 'description']
    });

    return result;
  }

  async getProductById(id: string | Types.ObjectId, req: RequestWithUser) {
    const product = await this.findOneById(id);

    if (req.user.role !== RoleEnum.SUPER_ADMIN && product.type !== ProductTypeEnum.PUBLIC) {
      throw new NotFoundException(
        'Product not found',
        {
          code: 'NOT_FOUND',
          details: {
            resource: 'Product',
            id: id.toString()
          }
        }
      );
    }

    return {
      message: 'Product retrieved successfully',
      data: product
    };
  }

  async updateProduct(
    id: string | Types.ObjectId,
    updateProductDto: UpdateProductDto
  ) {
    if (updateProductDto.discountPrice !== null && updateProductDto.discountPrice !== undefined) {
      const currentProduct = await this.findOneById(id);
      const priceToCompare = updateProductDto.price ?? currentProduct.price;

      if (updateProductDto.discountPrice >= priceToCompare) {
        throw new BadRequestException(
          'discountPrice must be less than price',
          {
            code: 'INVALID_DISCOUNT_PRICE',
            details: {
              discountPrice: updateProductDto.discountPrice,
              price: priceToCompare
            }
          }
        );
      }
    }

    const product = await this.update(id, updateProductDto);
    return {
      message: 'Product updated successfully',
      data: product
    };
  }

  async removeProduct(id: string | Types.ObjectId) {
    const product = await this.findOneById(id);
    await this.remove(id);
    return {
      message: 'Product deleted successfully',
      data: {
        id: product._id.toString(),
        sku: product.sku
      }
    };
  }
}

