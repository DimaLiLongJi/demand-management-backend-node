import { Controller, Body, Post, Res, Get, Req } from '@nestjs/common';
import { IResponse, Module } from '../types';
import { Request } from 'express';
import { ModuleService } from '../service/module.service';
import { ModuleEntity } from '../dao/module/module.entity';

@Controller('/api/module')
export class ModuleController {
  constructor(
    private readonly moduleService: ModuleService,
  ) { }

  @Post('/')
  public async create(
    @Body() mod: Module,
    @Req() req: Request,
  ): Promise<IResponse<ModuleEntity>> {
    try {
      mod.creator = Number(req.headers.authId);
      const modInfo = await this.moduleService.save(mod);
      return {
        success: true,
        message: '创建模块成功',
        data: modInfo,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  @Get('/all')
  public async getAll(): Promise<IResponse<[ModuleEntity[], number]>> {
    try {
      const modList = await this.moduleService.findAll();
      return {
        success: true,
        message: '获取全部模块成功',
        data: modList,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }
}
