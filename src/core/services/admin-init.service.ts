import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, UserDoc } from '@features/users/entities/user.entity';
import { RoleEnum } from '@features/users/enums/role.enum';

@Injectable()
export class AdminInitService {
  private readonly logger = new Logger(AdminInitService.name);

  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDoc>,
    private readonly configService: ConfigService
  ) {}

  async initializeAdmin(): Promise<void> {
    try {
      const adminEmail =
        this.configService.get<string>('ADMIN_EMAIL');
      const adminPassword = this.configService.get<string>(
        'ADMIN_PASSWORD'
      );

      const existingAdmin = await this.userModel.findOne({
        email: adminEmail,
        role: RoleEnum.ADMIN
      });

      if (existingAdmin) {
        this.logger.log(
          `Admin user already exists with email: ${adminEmail}`
        );
        return;
      }

      const adminData = {
        email: adminEmail,
        password: adminPassword,
        name: 'Admin',
        role: RoleEnum.ADMIN,
        credits: 0
      };

      await this.userModel.create(adminData);

      this.logger.log(
        `Admin user created successfully with email: ${adminEmail}`
      );
    } catch (error) {
      this.logger.error('Failed to initialize admin:', error);
      throw error;
    }
  }

  getAdminCredentials(): { email: string; password: string } {
    return {
      email: this.configService.get<string>('ADMIN_EMAIL')!,
      password: this.configService.get<string>('ADMIN_PASSWORD')!
    };
  }
}
