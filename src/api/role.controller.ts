import { Controller, Get, Body, Post, Query, Put, Param, Req } from '@nestjs/common';
import { RoleService } from '../service/role.service';
import { IResponse, Role } from '../types';
import { RoleEntity } from '../dao/role/role.entity';
import { Request } from 'express';

@Controller('/api/role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
  ) { }

  @Post('/')
  public async create(
    @Body() role: Role,
    @Req() req: Request,
  ): Promise<IResponse<RoleEntity>> {
    try {
      role.creator = Number(req.headers.authId);
      const roleInfo = await this.roleService.create(role);
      return {
        success: true,
        message: '创建角色成功',
        data: roleInfo,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  @Get('/find')
  public async find(
    @Query() params?: {
      pageIndex?: number,
      pageSize?: number,
      isOn?: '1' | '2',
    },
  ): Promise<IResponse<[RoleEntity[], number]>> {
    try {
      const roleList = await this.roleService.find(params);
      return {
        success: true,
        message: '获取全部角色成功',
        data: roleList,
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
  ): Promise<IResponse<RoleEntity>> {
    try {
      const permissionInfo = await this.roleService.findById(id);
      return {
        success: true,
        message: `获取id为${id}的角色成功`,
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
    @Body() role?: Role,
  ): Promise<IResponse> {
    try {
      return await this.roleService.update(id, role);
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }
}
