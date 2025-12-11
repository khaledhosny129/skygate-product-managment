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

  async getStatistics() {
    const stats = await this.m.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalInventoryValue: {
            $sum: { $multiply: ['$price', '$quantity'] }
          },
          totalDiscountedValue: {
            $sum: {
              $cond: [
                { $and: [{ $ne: ['$discountPrice', null] }, { $ne: ['$discountPrice', undefined] }] },
                { $multiply: ['$discountPrice', '$quantity'] },
                0
              ]
            }
          },
          totalPrice: { $sum: '$price' },
          outOfStockCount: {
            $sum: { $cond: [{ $eq: ['$quantity', 0] }, 1, 0] }
          },
          productsByCategory: {
            $push: {
              category: '$category',
              price: '$price',
              quantity: '$quantity',
              discountPrice: '$discountPrice'
            }
          },
          productsByType: {
            $push: {
              type: '$type',
              price: '$price',
              quantity: '$quantity',
              discountPrice: '$discountPrice'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalProducts: 1,
          totalInventoryValue: { $round: ['$totalInventoryValue', 2] },
          totalDiscountedValue: { $round: ['$totalDiscountedValue', 2] },
          averagePrice: {
            $round: [
              {
                $cond: [
                  { $gt: ['$totalProducts', 0] },
                  { $divide: ['$totalPrice', '$totalProducts'] },
                  0
                ]
              },
              2
            ]
          },
          outOfStockCount: 1,
          productsByCategory: 1,
          productsByType: 1
        }
      }
    ]);

    if (!stats || stats.length === 0) {
      return {
        message: 'Statistics retrieved successfully',
        data: {
          totalProducts: 0,
          totalInventoryValue: 0,
          totalDiscountedValue: 0,
          averagePrice: 0,
          outOfStockCount: 0,
          productsByCategory: [],
          productsByType: []
        }
      };
    }

    const result = stats[0];

    const categoryStats = await this.m.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalValue: {
            $sum: { $multiply: ['$price', '$quantity'] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          count: 1,
          totalValue: { $round: ['$totalValue', 2] }
        }
      },
      {
        $sort: { category: 1 }
      }
    ]);

    const typeStats = await this.m.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalValue: {
            $sum: { $multiply: ['$price', '$quantity'] }
          }
        }
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          count: 1,
          totalValue: { $round: ['$totalValue', 2] }
        }
      },
      {
        $sort: { type: 1 }
      }
    ]);

    return {
      message: 'Statistics retrieved successfully',
      data: {
        totalProducts: result.totalProducts,
        totalInventoryValue: result.totalInventoryValue,
        totalDiscountedValue: result.totalDiscountedValue,
        averagePrice: result.averagePrice,
        outOfStockCount: result.outOfStockCount,
        productsByCategory: categoryStats,
        productsByType: typeStats
      }
    };
  }
}

