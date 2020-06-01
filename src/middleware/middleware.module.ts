import { Module, Global } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';
import { AuthMiddleware } from './auth.middleware';

@Global()
@Module({
  providers: [
    AuthMiddleware,
    LoggerMiddleware,
  ],
  exports: [
    AuthMiddleware,
    LoggerMiddleware,
  ],
})
export class MiddlewareModule { }
