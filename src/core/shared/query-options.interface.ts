export interface QueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  searchFields?: string[];
  sort?: string;
  order?: 'asc' | 'desc';
  category?: string;
  type?: 'public' | 'private';
  minPrice?: number;
  maxPrice?: number;
}

