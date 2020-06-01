import { Injectable } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { DemandNodeEntity } from '../dao/demand-node/demand-node.entity';
import { DemandLogProperty, DemandLogType } from '../dao/demand-log/demand-log.entity';
import { DemandNodeDAO } from '../dao/demand-node/demand-node.dao';
import { DemandLogService } from './demand-log.service';
import { DemandProgressDAO } from '../dao/demand-progress/demand-progress.dao';
import { DemandNode, DemandLog } from '../types';

@Injectable()
export class DemandNodeService {
  constructor(
    private readonly demandNodeDAO: DemandNodeDAO,
    private readonly demandLogService: DemandLogService,
    private readonly demandProgressDAO: DemandProgressDAO,
  ) { }

  public async delete(id: number): Promise<DeleteResult> {
    const demandNode = await this.demandNodeDAO.findById(id);
    await this.demandLogService.save({
      creator: demandNode.creator.id,
      property: DemandLogProperty.demandNode,
      demand: demandNode.demandProgress.demand.id,
      type: DemandLogType.delete,
      newDetail: `${demandNode.detail}`,
    });
    return this.demandNodeDAO.delete(id);
  }

  public async save(demandNode: DemandNode): Promise<DemandNodeEntity> {
    console.log('创建的需求节点', demandNode);
    const demandProgress = await this.demandProgressDAO.findById(demandNode.demandProgress);
    await this.demandLogService.save({
      creator: demandNode.creator,
      property: DemandLogProperty.demandNode,
      demand: demandProgress.demand.id,
      type: DemandLogType.create,
      newDetail: `${demandNode.detail}`,
    });
    return this.demandNodeDAO.save(demandNode as any);
  }

  public findById(id: number) {
    return this.demandNodeDAO.findById(id);
  }

  public findByIds(ids?: number[]) {
    return this.demandNodeDAO.findByIds(ids);
  }

  public async update(id: number, params: DemandNode) {
    const demandNode = await this.demandNodeDAO.findById(id);
    if (!demandNode) return { success: false, message: `id 为 ${id} 的需求节点不存在` };
    try {
      const demandLogs: DemandLog[] = [];
      if (params.finished === '1') {
        params.finishDate = new Date();
        demandLogs.push({
          creator: params.creator,
          property: DemandLogProperty.demandNode,
          demand: demandNode.demandProgress.demand.id,
          type: DemandLogType.finish,
          newDetail: `${demandNode.demandProgress.user.name} 的id为${id}的需求节点`,
        });
      }
      if (params.finished === '2') {
        params.finishDate = null;
        demandLogs.push({
          creator: params.creator,
          property: DemandLogProperty.progress,
          demand: demandNode.demandProgress.demand.id,
          type: DemandLogType.unfinish,
          newDetail: `${demandNode.demandProgress.user.name} 的id为${id}的需求节点`,
        });
      }
      if (params.detail && params.detail !== demandNode.detail) {
        demandLogs.push({
          creator: params.creator,
          property: DemandLogProperty.progress,
          demand: demandNode.demandProgress.demand.id,
          type: DemandLogType.update,
          oldDetail: `${demandNode.detail}`,
          newDetail: `${params.detail}`,
        });
      }
      delete params.finished;
      delete params.creator;
      await this.demandNodeDAO.update(id, params);
      await this.demandLogService.saveAll(demandLogs);
      return { success: true, message: `id 为 ${id} 的需求节点更新成功` };
    } catch (e) {
      return { success: false, message: `id 为 ${id} 的需求节点更新失败，原因：${e}` };
    }
  }

  public async find(params?: {
    pageIndex?: number,
    pageSize?: number,
    demandProgress?: number,
    user?: number,
  }): Promise<[DemandNodeEntity[], number]> {
    return this.demandNodeDAO.find(params);
  }
}
