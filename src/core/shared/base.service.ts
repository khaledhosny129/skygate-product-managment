import { Document, Model, Types } from 'mongoose';

import {
  BadRequestException,
  ConflictException,
  NotFoundException
} from '@core/exceptions';
import { Pagination } from '@core/shared/pagination.dto';
import { QueryOptions } from '@core/shared/query-options.interface';

export class BaseService<T> {
  constructor(protected model: Model<T & Document>) {}

  public toObjectId(id: string | Types.ObjectId): Types.ObjectId {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid id', {
      code: 'INVALID_ID',
      details: 'Invalid id'
    });

    return typeof id === 'string' ? new Types.ObjectId(id) : id;
  }

  async updateById(
    id: string | Types.ObjectId,
    updates: any,
    projection = {}
  ): Promise<T> {
    try {
      const doc = await this.model.findByIdAndUpdate(
        this.toObjectId(id),
        updates,
        { new: true, projection }
      );
      if (!doc) {
        throw new NotFoundException(
          `${this.model.modelName} not found`,
          {
            code: 'NOT_FOUND',
            details: {
              resource: this.model.modelName
            }
          }
        );
      }

      return doc as unknown as T;
    } catch (err: any) {
      if (err.code === 11000) {
        const duplicateField = err.keyPattern ? Object.keys(err.keyPattern)[0] : undefined;
        const duplicateValue = err.keyValue ? err.keyValue[duplicateField || ''] : undefined;
        
        const modelName = this.model.modelName;
        const message = duplicateField 
          ? `${modelName} with this ${duplicateField} already exists`
          : `${modelName} already exists`;
        
        const errorCode = duplicateField 
          ? `DUPLICATE_${duplicateField.toUpperCase()}` 
          : 'DUPLICATE_RECORD';
        
        throw new ConflictException(
          message,
          {
            code: errorCode,
            details: {
              field: duplicateField,
              value: duplicateValue
            }
          }
        );
      }
      throw err;
    }
  }

  async create(model: any): Promise<T> {
    try {
      const doc = await this.model.create(model);
      return doc as T;
    } catch (err: any) {
      if (err.code === 11000) {
        const duplicateField = err.keyPattern ? Object.keys(err.keyPattern)[0] : undefined;
        const duplicateValue = err.keyValue ? err.keyValue[duplicateField || ''] : undefined;
        
        const modelName = this.model.modelName;
        const message = duplicateField 
          ? `${modelName} with this ${duplicateField} already exists`
          : `${modelName} already exists`;
        
        const errorCode = duplicateField 
          ? `DUPLICATE_${duplicateField.toUpperCase()}` 
          : 'DUPLICATE_RECORD';
        
        throw new ConflictException(
          message,
          {
            code: errorCode,
            details: {
              field: duplicateField,
              value: duplicateValue
            }
          }
        );
      }
      throw err;
    }
  }

  async findOne(filter: any, projection: any = {}): Promise<T> {
    const doc = await this.model.findOne(filter, projection).exec();

    return doc as T;
  }

  async findOneAndErr(filter: any, projection: any = {}): Promise<T> {
    const doc = await this.model.findOne(filter, projection).exec();
    if (!doc) {
      throw new NotFoundException(
        `${this.model.modelName} not found`,
        {
          code: 'NOT_FOUND',
          details: {
            resource: this.model.modelName
          }
        }
      );
    }

    return doc as T;
  }

  async findOneById(
    id: string | Types.ObjectId,
    projection: any = {}
  ): Promise<T> {
    const doc = await this.model
      .findById(this.toObjectId(id), projection)
      .exec();
    if (!doc) {
      throw new NotFoundException(
        `${this.model.modelName} with this id not found`,
        {
          code: 'NOT_FOUND',
          details: {
            resource: this.model.modelName,
            id: id.toString()
          }
        }
      );
    }

    return doc as T;
  }

  async find(
    filter: any = {},
    projection: any = {},
    queryOptions?: QueryOptions
  ): Promise<Pagination | T[] | { message: string; data: T[]; pagination: Pagination }> {
    if (!queryOptions) {
      const docs = await this.model.find(filter, projection).exec();
      return docs as unknown[] as T[];
    }

    const {
      page = 1,
      limit = 10,
      search,
      searchFields = [],
      sort = 'createdAt',
      order = 'desc',
      category,
      type,
      minPrice,
      maxPrice
    } = queryOptions;

    const query: any = { ...filter };

    if (search) {
      if (searchFields && searchFields.length > 0) {
        query.$or = searchFields.map(field => ({
          [field]: { $regex: search, $options: 'i' }
        }));
      }
    }

    if (category) {
      query.category = category;
    }

    if (type) {
      query.type = type;
    }

    if (minPrice !== undefined && minPrice !== null) {
      query.price = { ...query.price, $gte: Number(minPrice) };
    }

    if (maxPrice !== undefined && maxPrice !== null) {
      query.price = { ...query.price, $lte: Number(maxPrice) };
    }

    const skip = (page - 1) * limit;
    const sortOrder = order === 'asc' ? 1 : -1;

    const [docs, total] = await Promise.all([
      this.model
        .find(query, projection)
        .sort({ [sort]: sortOrder })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.model.countDocuments(query).exec()
    ]);

    return {
      message: `${this.model.modelName}s retrieved successfully`,
      data: docs as unknown[] as T[],
      pagination: new Pagination({
        count: total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      })
    };
  }

  async update(
    id: string | Types.ObjectId,
    updates: any,
    projection = {}
  ): Promise<T> {
    try {
      const doc = await this.model.findByIdAndUpdate(
        this.toObjectId(id),
        updates,
        {
          new: true,
          projection
        }
      );
      if (!doc) {
        throw new NotFoundException(
          `${this.model.modelName} with this id not found`,
          {
            code: 'NOT_FOUND',
            details: {
              resource: this.model.modelName,
              id: id.toString()
            }
          }
        );
      }

      return doc as T;
    } catch (err: any) {
      if (err.code === 11000) {
        const duplicateField = err.keyPattern ? Object.keys(err.keyPattern)[0] : undefined;
        const duplicateValue = err.keyValue ? err.keyValue[duplicateField || ''] : undefined;
        
        const modelName = this.model.modelName;
        const message = duplicateField 
          ? `${modelName} with this ${duplicateField} already exists`
          : `${modelName} already exists`;
        
        const errorCode = duplicateField 
          ? `DUPLICATE_${duplicateField.toUpperCase()}` 
          : 'DUPLICATE_RECORD';
        
        throw new ConflictException(
          message,
          {
            code: errorCode,
            details: {
              field: duplicateField,
              value: duplicateValue
            }
          }
        );
      }
      throw err;
    }
  }

  async remove(id: string | Types.ObjectId) {
    const doc = await this.model.findByIdAndDelete(this.toObjectId(id));
    if (!doc) {
      throw new NotFoundException(
        `${this.model.modelName} with this id not found`,
        {
          code: 'NOT_FOUND',
          details: {
            resource: this.model.modelName,
            id: id.toString()
          }
        }
      );
    }

    return true;
  }
}
