import { Controller, Get, Body, Post, Query, Put, Param, Delete, Req } from '@nestjs/common';
import { DemandProgressService } from '../service/demand-progress.service';
import { IResponse, DemandProgress } from '../types';
import { DemandProgressEntity } from '../dao/demand-progress/demand-progress.entity';
import { Request } from 'express';

@Controller('/api/demand-progress')
export class DemandProgressController {
  constructor(
    private readonly demandProgressService: DemandProgressService,
  ) { }

  @Post('/')
  public async create(
    @Body() demandProgress: DemandProgress,
    @Req() req: Request,
  ): Promise<IResponse<DemandProgressEntity>> {
    try {
      demandProgress.creator = Number(req.headers.authId);
      const demandProgressInfo = await this.demandProgressService.save(demandProgress);
      return {
        success: true,
        message: '创建需求进度成功',
        data: demandProgressInfo,
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
      demand?: number,
      user?: number,
    },
  ): Promise<IResponse<[DemandProgressEntity[], number]>> {
    try {
      const demandProgressList = await this.demandProgressService.find(params);
      return {
        success: true,
        message: '获取需求进度成功',
        data: demandProgressList,
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
  ): Promise<IResponse<DemandProgressEntity>> {
    try {
      const demandProgressInfo = await this.demandProgressService.findById(id);
      return {
        success: true,
        message: `获取id为${id}的需求进度成功`,
        data: demandProgressInfo,
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
    @Req() req: Request,
    @Body() demandProgress?: DemandProgress,
  ): Promise<IResponse> {
    try {
      if (demandProgress) demandProgress.creator = Number(req.headers.authId);
      return await this.demandProgressService.update(id, demandProgress);
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  @Delete(':id')
  public async delete(
    @Param('id') id: number,
  ): Promise<IResponse> {
    try {
      const deleteResult = await this.demandProgressService.delete(id);
      return {
        success: true,
        message: '删除需求进度成功',
        data: deleteResult,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }
}
