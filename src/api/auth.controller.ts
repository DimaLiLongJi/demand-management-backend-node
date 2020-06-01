import { Controller, Body, Post, Get, Res, Req } from '@nestjs/common';
import * as dayjs from 'dayjs';
import { IResponse } from '../types';
import { Response, Request } from 'express';
import { AuthService } from '../service/auth.service';
import { UserEntity } from 'src/dao/user/user.entity';

@Controller('/api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @Get('/')
  public async auth(
    @Req() req: Request,
  ): Promise<IResponse<UserEntity>> {
    const loginToken = req.cookies['10086ManageLoginToken'];
    const user = await this.authService.verify(loginToken);
    return {
      message: '验证成功',
      success: true,
      data: user,
    };
  }

  @Post('/login')
  public async login(
    @Body() info: { account: string, password: string },
    @Res() res: Response,
  ): Promise<IResponse> {
    const authAccount: { mobile?: string, email?: string, password: string } = {
      password: info.password,
    };
    if (/^\d+$/.test(info.account)) authAccount.mobile = info.account;
    else authAccount.email = info.account;

    try {
      const result = await this.authService.login(authAccount);
      const responseBody = {
        message: result.message,
        success: result.success,
      };
      if (result.success && result.message === '登录成功' && result.data.token) {
        res.cookie('10086ManageLoginToken', result.data.token, {
          httpOnly: true,
          expires: dayjs().add(7, 'day').toDate(), // 2天
        });
      }
      res.send(responseBody);
      return responseBody;
    } catch (e) {
      return {
        message: e,
        success: false,
      };
    }
  }

  @Get('/logout')
  public logout(
    @Res() res: Response,
    @Req() req: Request,
  ): void {
    const loginToken = req.cookies['10086ManageLoginToken'];
    if (loginToken) {
      res.clearCookie('10086ManageLoginToken').send({
        message: '退出登录成功',
        success: true,
      });
    } else {
      res.status(200).send({
        message: '用户并未登录',
        success: true,
      });
    }
  }
}
