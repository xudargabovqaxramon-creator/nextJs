import {ExceptionFilter,Catch,ArgumentsHost,HttpException} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
   const ctx = host.switchToHttp();
   const response = ctx.getResponse<Response>();
   const message = exception.message || 'Internal server error';
   const status = exception instanceof HttpException ? exception.getStatus() : 500


   response.status(status).json({
    statusCode: status,
    message: message || "Internal server error",
    error: exception.name || "UnknownError",
    stack: exception.stack || null,
    timestamp: new Date().toISOString()
   })
  }
}
