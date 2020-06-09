import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from '../service/auth.service';
import { EnvService } from '../service/env.service';
import { freeAuthPathReg } from '../constant/free-auth';
import { UserEntity } from '../dao/user/user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly authService: AuthService,
    private readonly envService: EnvService,
  ) {}

  public async use(req: Request, res: Response, next: () => void) {
    // 排除登录的接口
    let canPass = false;
    freeAuthPathReg.forEach(rex => {
      const reg = new RegExp(rex);
      if (reg.test(req.originalUrl)) canPass = true;
    });
    if (canPass) {
      next();
      return;
    }
    const loginToken = req.cookies['10086ManageLoginToken'];
    if (!loginToken) {
      res.status(404).send({
        success: false,
        message: '需要先登录',
      });
      return;
    }
    let user: UserEntity;
    try {
      user = await this.authService.verify(loginToken);
      if (!user || !user.name || !user.email || !user.mobile || user.deleteDate) {
        res.status(404).send({
          success: false,
          message: '用户不存在或已归档，无法登陆，请联系管理员',
        });
        return;
      } else {
        req.headers.authId = String(user.id);
        next();
        return;
      }
    } catch (e) {
      console.log('中间件验证失败：', e);
      res.status(404).send({
        success: false,
        message: `中间件验证失败：${e}`,
      });
      return;
    }
  }
}
