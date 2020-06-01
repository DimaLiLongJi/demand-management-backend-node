import { Injectable } from '@nestjs/common';
import { DemandStatusEntity } from '../dao/demand-status/demand-status.entity';
import { DemandStatusDAO } from '../dao/demand-status/demand-status.dao';
import { DemandStatus } from '../types';
import { IsNull, Not } from 'typeorm';

@Injectable()
export class DemandStatusService {
  constructor(
    private readonly demandStatusDAO: DemandStatusDAO,
  ) {}

  public async create(demandStatus: DemandStatus): Promise<DemandStatusEntity> {
    console.log('创建的需求状态:', demandStatus);
    return this.demandStatusDAO.save(demandStatus as any);
  }

  public find(params?: {
    pageIndex?: number,
    pageSize?: number,
    isOn?: '1' | '2',
    isEnd?: '1' | '2',
  }): Promise<[DemandStatusEntity[], number]> {
    const where: any = {
      ...params,
    };
    if (where.isOn) delete where.isOn;
    if (params.isOn) {
      where.deleteDate = (params.isOn === '1') ? IsNull() : Not(IsNull());
    }
    return this.demandStatusDAO.find(where);
  }

  public findById(id: number) {
    return this.demandStatusDAO.findById(id);
  }

  public findByIds(ids?: number[]) {
    return this.demandStatusDAO.findByIds(ids);
  }

  public async update(id: number, params: DemandStatus = {}) {
    const demandType = await this.demandStatusDAO.findById(id);
    if (!demandType) return { success: false, message: `id 为 ${id} 的需求状态不存在` };
    if (!params) return { success: true, message: `id 为 ${id} 的需求状态更新成功` };
    try {
      console.log('更新的需求状态:', id, params);
      if (params.isOn) {
        delete params.deleteDate;
        params.deleteDate = (params.isOn === '1') ? null : new Date();
        delete params.isOn;
     }
      await this.demandStatusDAO.update(id, params);
      return { success: true, message: `id 为 ${id} 的需求状态更新成功` };
    } catch (e) {
      return { success: false, message:  `id 为 ${id} 的需求状态更新失败，原因：${e}` };
    }
  }
}
