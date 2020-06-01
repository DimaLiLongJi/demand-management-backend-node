import { Controller, Get, Body, Post, Query, Put, Param, Delete, Req } from '@nestjs/common';
import { DemandNodeService } from '../service/demand-node.service';
import { IResponse, DemandNode } from '../types';
import { DemandNodeEntity } from '../dao/demand-node/demand-node.entity';
import { Request } from 'express';

@Controller('/api/demand-node')
export class DemandNodeController {
  constructor(
    private readonly demandNodeService: DemandNodeService,
  ) { }

  @Post('/')
  public async create(
    @Body() demandNode: DemandNode,
    @Req() req: Request,
  ): Promise<IResponse<DemandNodeEntity>> {
    try {
      demandNode.creator = Number(req.headers.authId);
      const demandNodeInfo = await this.demandNodeService.save(demandNode);
      return {
        success: true,
        message: '创建需求节点成功',
        data: demandNodeInfo,
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
      demandProgress?: number,
      user?: number,
    },
  ): Promise<IResponse<[DemandNodeEntity[], number]>> {
    try {
      const demandNodeList = await this.demandNodeService.find(params);
      return {
        success: true,
        message: '获取需求节点成功',
        data: demandNodeList,
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
  ): Promise<IResponse<DemandNodeEntity>> {
    try {
      const demandNodeInfo = await this.demandNodeService.findById(id);
      return {
        success: true,
        message: `获取id为${id}的需求节点成功`,
        data: demandNodeInfo,
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
    @Body() demandNode?: DemandNode,
  ): Promise<IResponse> {
    try {
      if (demandNode) demandNode.creator = Number(req.headers.authId);
      return await this.demandNodeService.update(id, demandNode);
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
      const deleteResult = await this.demandNodeService.delete(id);
      return {
        success: true,
        message: '删除需求节点成功',
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
