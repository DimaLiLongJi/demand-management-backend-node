import { Controller, Get, Body, Post, Query, Put, Param, Req } from '@nestjs/common';
import { DemandTypeService } from '../service/demand-type.service';
import { IResponse, DemandType, DemandTypeWithApprover } from '../types';
import { DemandTypeEntity } from '../dao/demand-type/demand-type.entity';
import { Request } from 'express';

@Controller('/api/demand-type')
export class DemandTypeController {
  constructor(
    private readonly demandTypeService: DemandTypeService,
  ) { }

  @Post('/')
  public async create(
    @Body() demandType: DemandType,
    @Req() req: Request,
  ): Promise<IResponse<DemandTypeEntity>> {
    try {
      demandType.creator = Number(req.headers.authId);
      const demandTypeInfo = await this.demandTypeService.create(demandType);
      return {
        success: true,
        message: '创建需求类型成功',
        data: demandTypeInfo,
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
  ): Promise<IResponse<[DemandTypeEntity[], number]>> {
    try {
      const demandTypeList = await this.demandTypeService.find(params);
      return {
        success: true,
        message: '获取需求类型成功',
        data: demandTypeList,
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
  ): Promise<IResponse<DemandTypeWithApprover>> {
    try {
      const demandTypeInfo = await this.demandTypeService.findById(id);
      return {
        success: true,
        message: `获取id为${id}的需求类型成功`,
        data: demandTypeInfo,
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
    @Body() demandType?: DemandType,
  ): Promise<IResponse> {
    try {
      const demandTypeInfo = await this.demandTypeService.update(id, demandType);
      return {
        success: true,
        message: '更新需求类型成功',
        data: demandTypeInfo,
      };
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
    @Body() demandType?: DemandType,
  ): Promise<IResponse> {
    try {
      const demandTypeInfo = await this.demandTypeService.update(id, demandType);
      return {
        success: true,
        message: '更新需求类型成功',
        data: demandTypeInfo,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }
}
