import { Injectable } from '@nestjs/common';
import { DeleteResult } from 'typeorm';
import { DemandProgressEntity } from '../dao/demand-progress/demand-progress.entity';
import { DemandLogType, DemandLogProperty } from '../dao/demand-log/demand-log.entity';
import { DemandProgress, DemandLog } from '../types';
import { DemandProgressDAO } from '../dao/demand-progress/demand-progress.dao';
import { DemandLogService } from './demand-log.service';

@Injectable()
export class DemandProgressService {
  constructor(
    private readonly demandProgressDAO: DemandProgressDAO,
    private readonly demandLogService: DemandLogService,
  ) {}

  public delete(id: number): Promise<DeleteResult> {
    return this.demandProgressDAO.delete(id);
  }

  public removeByIds(ids: DemandProgressEntity[]): Promise<DemandProgressEntity[]> {
    return this.demandProgressDAO.removeByIds(ids);
  }

  public async save(demandProgress: DemandProgress): Promise<DemandProgressEntity> {
    console.log('创建的需求进度', demandProgress);
    return this.demandProgressDAO.save(demandProgress as any);
  }

  public async update(id: number, params: DemandProgress) {
    const demandProgress = await this.demandProgressDAO.findById(id);
    if (!demandProgress) return { success: false, message: `id 为 ${id} 的需求进度不存在` };
    try {
      const demandLogs: DemandLog[] = [];
      const progressName = demandProgress.type === '1' ? '开发任务' : '运维或其他任务';
      if (params.finished === '1') {
        params.finishDate = new Date();
        demandLogs.push({
          creator: params.creator,
          demand: demandProgress.demand.id,
          property: DemandLogProperty.progress,
          type: DemandLogType.finish,
          newDetail: `${demandProgress.user.name} 的${progressName}`,
        });
      }
      if (params.finished === '2') {
        params.finishDate = null;
        demandLogs.push({
          creator: params.creator,
          demand: demandProgress.demand.id,
          property: DemandLogProperty.progress,
          type: DemandLogType.unfinish,
          newDetail: `${demandProgress.user.name} 的${progressName}`,
        });
      }
      if (params.scheduleStartDate) {
        demandLogs.push({
          creator: params.creator,
          demand: demandProgress.demand.id,
          property: DemandLogProperty.progress,
          type: DemandLogType.updateProgressDate,
          oldDetail: `${demandProgress.user.name} 的 ${progressName} 的 排期开始时间`,
          newDetail: new Date(params.scheduleStartDate) as any,
        });
      }
      if (params.scheduleEndDate) {
        demandLogs.push({
          creator: params.creator,
          demand: demandProgress.demand.id,
          property: DemandLogProperty.progress,
          type: DemandLogType.updateProgressDate,
          oldDetail: `${demandProgress.user.name} 的 ${progressName} 的 排期结束时间`,
          newDetail: new Date(params.scheduleEndDate) as any,
        });
      }
      delete params.finished;
      delete params.creator;
      await this.demandProgressDAO.update(id, params);
      await this.demandLogService.saveAll(demandLogs);
      return { success: true, message: `id 为 ${id} 的需求进度更新成功` };
    } catch (e) {
      return { success: false, message:  `id 为 ${id} 的需求进度更新失败，原因：${e}` };
    }
  }

  public findById(id: number) {
    return this.demandProgressDAO.findById(id);
  }

  public findByIds(ids?: number[]) {
    return this.demandProgressDAO.findByIds(ids);
  }

  public async find(params?: {
    pageIndex?: number,
    pageSize?: number,
    demand?: number,
    user?: number,
  }): Promise<[DemandProgressEntity[], number]> {
    return this.demandProgressDAO.find(params);
  }
}
