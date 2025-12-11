import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Pagination } from '@core/shared/pagination.dto';

export interface SuccessResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  pagination?: Record<string, any> | null;
}

@Injectable()
export class ResponseWrapperInterceptor<T> implements NestInterceptor<T, SuccessResponse<T>> {

  intercept(_context: ExecutionContext, next: CallHandler): Observable<SuccessResponse<T>> {

    return next
      .handle()
      .pipe(
        map(data =>  {
          let message = 'Request successful';
          let responseData = data;
          let pagination: Record<string, any> | null = null;

          if (data && typeof data === 'object' && 'message' in data && 'data' in data) {
            message = data.message;
            responseData = data.data;
            
            if ('pagination' in data && data.pagination) {

              if (data.pagination instanceof Pagination) {
                pagination = data.pagination.toPaginationMeta();

              } else if (typeof data.pagination === 'object') {
                pagination = data.pagination;
              }
            }
          } else if (data && typeof data === 'object' && 'pagination' in data) {

            if (data.pagination instanceof Pagination) {
              pagination = data.pagination.toPaginationMeta();
              
            } else if (typeof data.pagination === 'object') {
              pagination = data.pagination;
            }
          }

          return {
            success: true,
            message,
            data: responseData,
            ...(pagination && { pagination })
          };
        })
      );
  }
}
