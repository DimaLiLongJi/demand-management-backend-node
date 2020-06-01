import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  public use(req: Request, res: Response, next: () => void) {
    console.log('中间件拦截的url:', req.originalUrl);
    console.log('中间件拦截的请求头:', req.headers);
    console.log('中间件拦截的请求体:', req.body);
    next();
  }
}
