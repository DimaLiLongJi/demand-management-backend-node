import { Module, Global } from '@nestjs/common';
import { LoggingInterceptor } from './logging.interceptor';

@Global()
@Module({
  providers: [LoggingInterceptor],
  exports: [LoggingInterceptor],
})
export class InterceptorModule { }
