import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { Response } from 'express';
import { BaseException } from '@core/exceptions/base.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger;

  constructor() {
    this.logger = new Logger(HttpExceptionFilter.name);
  }

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof BaseException) {
      const statusCode = exception.code;
      const message = exception.message || 'Internal server error';
      const error = exception.error;

      return response.status(statusCode).json({
        success: false,
        message,
        error
      });
    }

    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (exception instanceof BadRequestException) {
        const messages = exceptionResponse['message'];
        
        if (Array.isArray(messages) || (typeof messages === 'string' && messages.length > 0)) {
          const messageArray = Array.isArray(messages) ? messages : [messages];
          const validationErrors = this.formatValidationErrors(messageArray);
          
          return response.status(statusCode).json({
            success: false,
            message: 'Validation failed',
            error: {
              code: 'VALIDATION_ERROR',
              details: validationErrors
            }
          });
        }
      }

      const message = typeof exceptionResponse === 'string' 
        ? exceptionResponse 
        : exceptionResponse['message'] || exception.message || 'Bad request';
      
      const error = typeof exceptionResponse === 'object' && exceptionResponse['error']
        ? { code: exceptionResponse['error'], details: message }
        : { code: 'HTTP_EXCEPTION', details: message };

      return response.status(statusCode).json({
        success: false,
        message,
        error
      });
    }

    this.logger.error('Unhandled exception', exception.stack);
    
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message || 'Internal server error';

    return response.status(statusCode).json({
      success: false,
      message,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        details: 'An unexpected error occurred'
      }
    });
  }

  private formatValidationErrors(messages: string[]): Array<{ field: string; message: string }> {
    return messages.map((message: string) => {
      const fieldMatch = message.match(/(?:property\s+)?(\w+)(?:\s+should|\s+must)/i) || 
                        message.match(/^(\w+)\s/);
      const field = fieldMatch ? fieldMatch[1] : 'unknown';
      
      return {
        field,
        message
      };
    });
  }
}
