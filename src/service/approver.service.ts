import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { ApproverDAO } from 'src/dao/approver/approver.dao';
import { Connection } from 'typeorm';
import { Approver } from 'src/types/approver';
import { ApproverEntity } from 'src/dao/approver/approver.entity';
import { Demand } from 'src/types';

@Injectable()
export class ApproverService {
  constructor(
    private readonly approverDAO: ApproverDAO,
    @InjectConnection() private connection: Connection,
  ) {}

  public async findAll(): Promise<ApproverEntity[]> {
    return this.approverDAO.findAll();
  }

  public async findByWhere(where: Approver): Promise<ApproverEntity[]> {
    return this.approverDAO.findByWhere(where);
  }

  public async saveAll(approvers: Approver[]): Promise<ApproverEntity> {
    return this.approverDAO.saveAll(approvers);
  }

  public async updateApproverList(demandTypeId: number, approverList: Array<{ demandStatusId: number, approvers: number[] }>) {
    this.connection.transaction(async entityManager => {
      // 先删除审批人再添加
      const findApprovers = await this.approverDAO.findByWhere({
        demandType: demandTypeId,
      });
      await this.approverDAO.delete(findApprovers);
      if (approverList) {
        const list: Approver[] = [];
        approverList.forEach(approver => {
          if (approver.demandStatusId && approver.approvers && approver.approvers.length > 0) {
            approver.approvers.forEach(user => {
              list.push({
                demandType: demandTypeId,
                demandStatus: approver.demandStatusId,
                user,
              });
            });
          }
        });
        await this.approverDAO.saveAll(list);
      }
    });
  }
}
