import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApproverEntity } from './approver.entity';
import { Approver } from 'src/types/approver';
import { Demand } from 'src/types';

@Injectable()
export class ApproverDAO {
  constructor(
    @InjectRepository(ApproverEntity)
    private readonly entity: Repository<ApproverEntity>,
  ) { }

  public async save(approver: Approver): Promise<ApproverEntity> {
    return this.entity.save(approver as any);
  }

  public async saveAll(approvers: Approver[]): Promise<ApproverEntity> {
    return this.entity.save(approvers as any);
  }

  public async findAll(): Promise<ApproverEntity[]> {
    return this.entity.find({
      relations: ['user', 'demandType', 'demandStatus'],
      order: {
        id: 'ASC',
      },
    });
  }

  public async findOne(where: any): Promise<ApproverEntity> {
    return this.entity.findOne({
      where,
      relations: ['user', 'demandType', 'demandStatus'],
    });
  }

  public async findByWhere(where: Demand): Promise<ApproverEntity[]> {
    return this.entity.find({
      where,
      relations: ['user', 'demandType', 'demandStatus'],
    });
  }

  public async findById(id: number): Promise<ApproverEntity> {
    return this.entity.findOne(id, { relations: ['user', 'demandType', 'demandStatus'] });
  }

  public async findByIds(ids?: number[]): Promise<ApproverEntity[]> {
    return this.entity.findByIds(ids, {
      relations: ['user', 'demandType', 'demandStatus'],
      order: {
        id: 'ASC',
      },
    });
  }

  public async delete(approvers: ApproverEntity[]) {
    return this.entity.remove(approvers);
  }

}
