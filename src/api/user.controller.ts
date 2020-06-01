import { Controller, Get, Body, Post, Query, Put, Param, Req, Header, Res } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { IResponse, User } from '../types';
import { UserEntity } from '../dao/user/user.entity';
import { Request, Response } from 'express';
import * as dayjs from 'dayjs';

@Controller('/api/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) { }

  @Get('/all')
  public async getAll(): Promise<IResponse<UserEntity[]>> {
    try {
      const userList = await this.userService.findAll();
      return {
        success: true,
        message: '获取全部用户成功',
        data: userList,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  @Get('/download')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  public async download(
    @Res() res: Response,
    @Query() params?: {
      isOn?: '1' | '2',
      keyword?: string,
    },
  ): Promise<void> {
    try {
      const excel = await this.userService.downLoad(params);
      res.attachment(`用户列表_${dayjs().format('YYYY年MM月DD日HH:mm:ss')}.xlsx`);
      res.send(excel);
    } catch (e) {
      console.error('下载用户列表失败', e);
      res.status(404).end(JSON.stringify({
        success: false,
        message: e,
      }));
    }
  }

  @Get('/find')
  public async find(
    @Query() params?: {
      pageIndex?: number,
      pageSize?: number,
      isOn?: '1' | '2',
      keyword?: string,
    },
  ): Promise<IResponse<[UserEntity[], number]>> {
    try {
      const userList = await this.userService.find(params);
      return {
        success: true,
        message: '获取全部用户成功',
        data: userList,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  @Get(':id')
  public async getById(
    @Param('id') id: number,
  ): Promise<IResponse<UserEntity>> {
    try {
      const userInfo = await this.userService.findById(id);
      return {
        success: true,
        message: `获取id为${id}的用户成功`,
        data: userInfo,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  @Post('/')
  public async create(
    @Body() user: User,
    @Req() req: Request,
  ): Promise<IResponse<UserEntity>> {
    try {
      user.creator = Number(req.headers.authId);
      const userInfo = await this.userService.create(user);
      return {
        success: true,
        message: '创建用户成功',
        data: userInfo,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  @Put('/:id')
  public async update(
    @Param('id') id: number,
    @Req() req: Request,
    @Body() user?: User,
  ): Promise<IResponse> {
    try {
      user.creator = Number(req.headers.authId);
      return await this.userService.update(id, user);
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  @Put('/:id/password')
  public async updatePassword(
    @Param('id') id: number,
    @Body('password') password: string,
  ): Promise<IResponse> {
    try {
      return await this.userService.updatePassword(id, password);
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }
}
