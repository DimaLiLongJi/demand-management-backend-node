import { Controller, Get, Param, Body, Post } from '@nestjs/common';
import { IResponse, IDemandTypeStatusIndex } from '../types';
import { DemandTypeStatusIndexService } from 'src/service/demand-type-status-index';
import { DemandTypeStatusIndexEntity } from 'src/dao/demand-type-stataus-index/demand-type-stataus-index.entity';

@Controller('/api/demand-type-stataus-index')
export class DemandTypeStatusIndexDAOController {
  constructor(
    private readonly demandTypeStatusIndexService: DemandTypeStatusIndexService,
  ) { }

  @Get('/:typeId')
  public async getAll(
    @Param('typeId') typeId: number,
  ): Promise<IResponse<DemandTypeStatusIndexEntity[]>> {
    try {
      const list = await this.demandTypeStatusIndexService.findByDemandTypeId(typeId);
      return {
        success: true,
        message: '获取全部需求类型顺序成功',
        data: list,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  @Post('/:typeId')
  public async create(
    @Param('typeId') typeId: number,
    @Body() indexList: IDemandTypeStatusIndex[],
  ): Promise<IResponse<DemandTypeStatusIndexEntity[]>> {
    try {
      const list = await this.demandTypeStatusIndexService.createIndexList(typeId, indexList);
      return {
        success: true,
        message: '创建需求类型顺序成功',
        data: list,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }
}
