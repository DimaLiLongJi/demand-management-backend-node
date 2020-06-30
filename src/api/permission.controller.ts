import { Controller, Get, Req, Post, Put, Body, Query, Param } from '@nestjs/common';
import { IResponse, Permission } from '../types/index';
import { PermissionEntity } from '../dao/permission/permission.entity';
import { PermissionService } from '../service/permission.service';
import { Request } from 'express';

@Controller('/api/permission')
export class PermissionController {
  constructor(
    private readonly permissionService: PermissionService,
  ) { }

  @Get('/find')
  public async find(
    @Query() params?: {
      type?: '1' | '2',
      pageIndex?: number,
      pageSize?: number,
      isOn?: '1' | '2',
    },
  ): Promise<IResponse<[PermissionEntity[], number]>> {
    try {
      const permissionList = await this.permissionService.find(params);
      return {
        success: true,
        message: '搜索权限成功',
        data: permissionList,
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
  ): Promise<IResponse<PermissionEntity>> {
    try {
      const permissionInfo = await this.permissionService.findById(id);
      return {
        success: true,
        message: `获取id为${id}的权限成功`,
        data: permissionInfo,
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
    @Body() permission: Permission,
    @Req() req: Request,
  ): Promise<IResponse<PermissionEntity>> {
    try {
      permission.creator = Number(req.headers.authId);
      const permissionInfo = await this.permissionService.save(permission);
      return {
        success: true,
        message: '创建权限成功',
        data: permissionInfo,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  @Put(':id')
  public async update(
    @Param('id') id: number,
    @Body() permission?: Permission,
  ): Promise<IResponse> {
    try {
      return await this.permissionService.update(id, permission);
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  @Post(':id')
  public async update2(
    @Param('id') id: number,
    @Body() permission?: Permission,
  ): Promise<IResponse> {
    try {
      return await this.permissionService.update(id, permission);
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

}
