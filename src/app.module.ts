import { Module } from '@nestjs/common';
import { DAOModule } from './dao/dao.module';
import { InterceptorModule } from './interceptor/interceptor.module';
import { MiddlewareModule } from './middleware/middleware.module';
import { ApiModule } from './api/api.module';
import { PagesModule } from './pages/pages.module';
import { ServiceModule } from './service/service.module';

@Module({
  imports: [
    DAOModule,
    ServiceModule,
    InterceptorModule,
    MiddlewareModule,
    PagesModule,
    ApiModule,
  ],
})
export class AppModule { }
