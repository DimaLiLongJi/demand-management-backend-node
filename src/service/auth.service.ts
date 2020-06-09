import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { UserDAO } from '../dao/user/user.dao';
import { UserEntity } from 'src/dao/user/user.entity';
import * as crypto from 'crypto';
import { IResponse } from '../types';

export interface IAuthPayload {
  email: string;
  mobile: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userDAO: UserDAO,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 验证登录是否成功并设置jwt
   *
   * @param {{ mobile?: string, email?: string, password: string }} info
   * @returns {Promise<IResponse<{token: string}>>}
   * @memberof AuthService
   */
  public async login(info: { mobile?: string, email?: string, password: string }): Promise<IResponse<{token: string}>> {
    let where = {};
    if (info.mobile) {
      where = {mobile: info.mobile};
    }
    if (info.email) {
      where = {email: info.email};
    }
    const user = await this.userDAO.findByMobileOrEmail(where);
    if (user) {
      const saltPassword = user.salt + ':' + info.password;
      const md5 = crypto.createHash('md5');
      const password = md5.update(saltPassword).digest('hex');
      // 检查密码
      if (password === user.password) {
        // 没已归档允许登录
        if (!user.deleteDate) {
          const token = await this.signIn({
            email: user.email,
            mobile: user.mobile,
          });
          return {
            message: '登录成功',
            success: true,
            data: {
              token,
            },
          };
        } else {
          // 已归档不允许登录
          return {
            message: '该用户已归档，无法登陆，请联系管理员',
            success: false,
          };
        }
      } else {
        return {
          message: '密码不正确，请再次输入',
          success: false,
        };
      }
    } else {
      return {
        message: '该登录用户不存在',
        success: false,
      };
    }
  }

  /**
   *
   *
   * @param {IAuthPayload} info
   * @returns {Promise<string>}
   * @memberof AuthService
   */
  public async signIn(info: IAuthPayload): Promise<string> {
    return this.jwtService.sign(info);
  }

  /**
   * 验证签名
   *
   * @param {string} token
   * @returns {Promise<UserEntity>}
   * @memberof AuthService
   */
  public async verify(token: string): Promise<UserEntity> {
    let payload: IAuthPayload;
    try {
      payload = await this.jwtService.verify(token);
      return this.validateUser(payload);
    } catch (e) {
      console.error('验证签名错误：', e);
      return null;
    }
  }

  /**
   * 验证用户
   *
   * @param {IAuthPayload} payload
   * @returns {Promise<UserEntity>}
   * @memberof AuthService
   */
  private async validateUser(payload: IAuthPayload): Promise<UserEntity> {
    return await this.userDAO.findByMobileOrEmail({
      email: payload.email,
      mobile: payload.mobile,
    });
  }
}
