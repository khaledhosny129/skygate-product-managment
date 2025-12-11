import { ApiProperty } from '@nestjs/swagger';

export class PaginationMeta {
  @ApiProperty({ example: 1 })
  currentPage: number;

  @ApiProperty({ example: 5 })
  totalPages: number;

  @ApiProperty({ example: 48 })
  totalItems: number;

  @ApiProperty({ example: 10 })
  itemsPerPage: number;

  @ApiProperty({ example: true })
  hasNextPage: boolean;

  @ApiProperty({ example: false })
  hasPreviousPage: boolean;
}

export class Pagination {
  constructor(args: any = {}) {
    Object.assign(this, args);
  }

  count = 0;

  page?: number;

  limit?: number;

  totalPages?: number;

  toPaginationMeta(): PaginationMeta {
    return {
      currentPage: this.page || 1,
      totalPages: this.totalPages || 0,
      totalItems: this.count || 0,
      itemsPerPage: this.limit || 10,
      hasNextPage: (this.page || 1) < (this.totalPages || 0),
      hasPreviousPage: (this.page || 1) > 1
    };
  }
}
