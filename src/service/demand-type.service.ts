import { Injectable } from '@nestjs/common';
import { DemandTypeEntity } from '../dao/demand-type/demand-type.entity';
import { DemandTypeDAO } from '../dao/demand-type/demand-type.dao';
import { DemandStatusDAO } from '../dao/demand-status/demand-status.dao';
import { DemandType } from '../types';
import { IsNull, Not } from 'typeorm';
import { Approver } from 'src/types/approver';
import { ApproverService } from './approver.service';

@Injectable()
export class DemandTypeService {
  constructor(
    private readonly demandTypeDAO: DemandTypeDAO,
    private readonly demandStatusDAO: DemandStatusDAO,
    private readonly approverService: ApproverService,
  ) {}

  public async create(demandType: DemandType): Promise<DemandTypeEntity> {
    const createdDemandType: any = { ...demandType };
    if (demandType.demandStatusIds) {
      createdDemandType.demandStatusList = await this.demandStatusDAO.findByIds(demandType.demandStatusIds);
      delete createdDemandType.demandStatusIds;
    }
    console.log('创建的需求类型:', createdDemandType);
    const newDemandType = await this.demandTypeDAO.save(createdDemandType as any);
    if (demandType.approverList) {
      const approverList: Approver[] = [];
      demandType.approverList.forEach(approver => {
        if (approver.demandStatusId && approver.approvers && approver.approvers.length > 0) {
          approver.approvers.forEach(user => {
            approverList.push({
              demandType: newDemandType.id,
              demandStatus: approver.demandStatusId,
              user,
            });
          });
        }
      });
      await this.approverService.saveAll(approverList);
    }
    return newDemandType;
  }

  public find(params?: {
    pageIndex?: number,
    pageSize?: number,
    isOn?: '1' | '2',
  }): Promise<[DemandTypeEntity[], number]> {
    const where: any = {
      ...params,
    };
    if (where.isOn) delete where.isOn;
    if (params.isOn) {
      where.deleteDate = (params.isOn === '1') ? IsNull() : Not(IsNull());
    }
    return this.demandTypeDAO.find(where);
  }

  public async findById(id: number) {
    const demandType = await this.demandTypeDAO.findById(id);
    const approvers = await this.approverService.findByWhere({
      demandType: id,
    });
    const approverList: Array<{ demandStatusId: number,  approvers: number[] }> = [];
    approvers.forEach(approve => {
      const find = approverList.find(a => a.demandStatusId === approve.demandStatus.id);
      if (!find) {
        approverList.push({
          demandStatusId: approve.demandStatus.id,
          approvers: [approve.user.id],
        });
      } else {
        find.approvers.push(approve.user.id);
      }
    });
    return {
      ...demandType,
      approverList,
    };
  }

  public findByIds(ids?: number[]) {
    return this.demandTypeDAO.findByIds(ids);
  }

  public async update(id: number, params: DemandType = {}) {
    const demandType = await this.demandTypeDAO.findById(id);
    if (!demandType) return { success: false, message: `id 为 ${id} 的需求类型不存在` };
    if (!params) return { success: true, message: `id 为 ${id} 的需求类型更新成功` };
    try {
      const updatedDemandType: any = {
        ...demandType,
        ...params,
      };
      if (params.demandStatusIds) {
        updatedDemandType.demandStatusList = await this.demandStatusDAO.findByIds(params.demandStatusIds);
        delete updatedDemandType.demandStatusIds;
      }
      if (params.isOn) {
        delete updatedDemandType.deleteDate;
        delete updatedDemandType.isOn;
        updatedDemandType.deleteDate = (params.isOn === '1') ? null : new Date();
     }
      await this.demandTypeDAO.save(updatedDemandType);

      await this.approverService.updateApproverList(id, params.approverList);

      return { success: true, message: `id 为 ${id} 的需求类型更新成功` };
    } catch (e) {
      return { success: false, message:  `id 为 ${id} 的需求类型更新失败，原因：${e}` };
    }
  }
}
