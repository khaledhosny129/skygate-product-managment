import {
  Injectable
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { Types } from 'mongoose';

import { BadRequestException, NotFoundException, UnauthorizedException } from '@core/exceptions';

import { BaseService } from '@core/shared/base.service';
import { QueryOptions } from '@core/shared/query-options.interface';
import { UpdatePasswordDto } from '@features/users/dto/update-password.dto';
import { User, UserDoc } from '@features/users/entities/user.entity';

@Injectable()
export class UsersService extends BaseService<UserDoc> {
  constructor(
    @InjectModel(User.name)
    private readonly m: Model<UserDoc>
  ) {
    super(m);
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(
        `User with email ${email} not found`,
        {
          code: 'NOT_FOUND',
          details: {
            resource: 'User',
            email
          }
        }
      );
    }
    return user;
  }

  async getUserById(id: string | Types.ObjectId, projection: any = {}) {
    const user = await this.findOneById(id, projection);
    return {
      message: 'User retrieved successfully',
      data: user
    };
  }

  async findAll(
    filter: any = {},
    projection: any = {},
    queryOptions?: QueryOptions
  ) {
    return await this.find(filter, projection, queryOptions);
  }

  async updateUser(
    id: string | Types.ObjectId,
    updates: any,
    projection = {}
  ) {
    const user = await this.update(id, updates, projection);
    return {
      message: 'User updated successfully',
      data: user
    };
  }

  async removeUser(id: string) {
    await this.remove(id);
    return {
      message: 'User deleted successfully',
      data: null
    };
  }

  async updatePasswordMe(id: string, updatePasswordDto: UpdatePasswordDto) {
    const user = await this.findOneById(id);
    const isPasswordValid = await bcrypt.compare(
      updatePasswordDto.oldPassword,
      user.password
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        'Invalid credentials',
        {
          code: 'INVALID_CREDENTIALS',
          details: 'Invalid credentials'
        }
      );
    }
    if (updatePasswordDto.password !== updatePasswordDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match', {
        code: 'PASSWORD_DO_NOT_MATCH',
        details: 'Passwords do not match'
      });
    }
    user.password = updatePasswordDto.password;
    await this.update(id, { password: updatePasswordDto.password });

    delete user.toObject().password;

    return {
      message: 'Password updated successfully',
      data: {
        ...user.toObject()
      }
    };
  }
}
