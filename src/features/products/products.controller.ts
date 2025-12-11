import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { RequestWithUser } from '@core/interfaces/user-request.interface';
import { QueryParamsDto } from '@core/shared/query-params.dto';
import { JwtAuthGuard } from '@features/auth/guards/jwt-auth.guard';
import { RoleGuard } from '@features/auth/guards/role.guard';
import { Roles } from '@features/auth/roles.decorator';
import { CreateProductDto } from '@features/products/dto/create-product.dto';
import { UpdateProductDto } from '@features/products/dto/update-product.dto';
import { RoleEnum } from '@features/users/enums/role.enum';
import { ProductsService } from '@features/products/products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product - Admin Only' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.ADMIN)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with filtering - User and Admin' })
  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  findAll(@Query() queryParams: QueryParamsDto, @Req() req: RequestWithUser) {
    return this.productsService.findAll(
      {},
      {},
      req,
      queryParams
    );
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get product statistics - Admin Only' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.ADMIN)
  getStatistics() {
    return this.productsService.getStatistics();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by id - User and Admin' })
  @UseGuards(JwtAuthGuard)
  @Roles(RoleEnum.ADMIN, RoleEnum.USER)
  findOne(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.productsService.getProductById(id, req);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product by id - Admin Only' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.ADMIN)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by id - Admin Only' })
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(RoleEnum.ADMIN)
  remove(@Param('id') id: string) {
    return this.productsService.removeProduct(id);
  }
}

