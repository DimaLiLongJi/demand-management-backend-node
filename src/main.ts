import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { EnvService } from './service/env.service';

const envService = new EnvService();
const config = envService.getConfig();

async function main() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  app.setGlobalPrefix('/demand-manager');
  app.use(cookieParser());
  // 静态资源
  app.useStaticAssets(join(__dirname, '../static'), {
    prefix: '/demand-manager/static/',
  });
  // 视图模板引擎
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('ejs');

  await app.listen(config.port);
  console.log(`应用启动并监听 ${config.port} 端口`);
}
main();
