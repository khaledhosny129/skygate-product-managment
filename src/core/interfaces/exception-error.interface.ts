export interface ExceptionError {
  code: string;
  details: string | Record<string, any> | Record<string, any>[];
}

