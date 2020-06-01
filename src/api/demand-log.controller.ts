import { Controller, Get, Body, Post, Query, Put, Param, Delete, Req } from '@nestjs/common';
import { DemandLogService } from '../service/demand-log.service';
import { IResponse, DemandLog } from '../types';
import { DemandLogEntity } from '../dao/demand-log/demand-log.entity';
import { Request } from 'express';

@Controller('/api/demand-log')
export class DemandLogontroller {
  constructor(
    private readonly demandLogService: DemandLogService,
  ) { }

  @Post('/')
  public async create(
    @Body() demandLog: DemandLog,
    @Req() req: Request,
  ): Promise<IResponse<DemandLogEntity>> {
    try {
      demandLog.creator = Number(req.headers.authId);
      const demandLogInfo = await this.demandLogService.save(demandLog);
      return {
        success: true,
        message: '创建需求日志成功',
        data: demandLogInfo,
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
      demand?: number,
      creator?: number,
    },
  ): Promise<IResponse<[DemandLogEntity[], number]>> {
    try {
      const demandLogList = await this.demandLogService.find(params);
      return {
        success: true,
        message: '获取需求日志成功',
        data: demandLogList,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }
}
