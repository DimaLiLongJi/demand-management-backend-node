import { Controller, Get, Body, Post, Query, Put, Param, Req } from '@nestjs/common';
import { DemandStatusService } from '../service/demand-status.service';
import { IResponse, DemandStatus } from '../types';
import { Request } from 'express';
import { DemandTypeEntity } from '../dao/demand-type/demand-type.entity';

@Controller('/api/demand-status')
export class DemandStatusController {
  constructor(
    private readonly demandStatusService: DemandStatusService,
  ) { }

  @Post('/')
  public async create(
    @Body() demandStatus: DemandStatus,
    @Req() req: Request,
  ): Promise<IResponse<DemandTypeEntity>> {
    try {
      demandStatus.creator = Number(req.headers.authId);
      const demandStatusInfo = await this.demandStatusService.create(demandStatus);
      return {
        success: true,
        message: '创建需求状态成功',
        data: demandStatusInfo,
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
      const demandStatusList = await this.demandStatusService.find(params);
      return {
        success: true,
        message: '获取需求状态成功',
        data: demandStatusList,
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
  ): Promise<IResponse<DemandTypeEntity>> {
    try {
      const demandStatusInfo = await this.demandStatusService.findById(id);
      return {
        success: true,
        message: `获取id为${id}的需求状态成功`,
        data: demandStatusInfo,
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
    @Body() demandStatus?: DemandStatus,
  ): Promise<IResponse> {
    try {
      const demandStatusInfo = await this.demandStatusService.update(id, demandStatus);
      return {
        success: true,
        message: '更新需求状态成功',
        data: demandStatusInfo,
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
    @Body() demandStatus?: DemandStatus,
  ): Promise<IResponse> {
    try {
      const demandStatusInfo = await this.demandStatusService.update(id, demandStatus);
      return {
        success: true,
        message: '更新需求状态成功',
        data: demandStatusInfo,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }
}
