import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, DeleteResult } from 'typeorm';
import { DemandProgressEntity } from './demand-progress.entity';

@Injectable()
export class DemandProgressDAO {
  constructor(
    @InjectRepository(DemandProgressEntity)
    private readonly demandProgressEntity: Repository<DemandProgressEntity>,
  ) {}

  public async createList(demandProgressList: DemandProgressEntity[]): Promise<DemandProgressEntity[]> {
    return this.demandProgressEntity.save(demandProgressList as any);
  }

  public async save(demandProgress: DemandProgressEntity): Promise<DemandProgressEntity> {
    return this.demandProgressEntity.save(demandProgress as any);
  }

  public async findAll(): Promise<DemandProgressEntity[]> {
    return this.demandProgressEntity.find({
      relations: ['creator', 'demand', 'user', 'demandNodeList'],
      order: {
        id: 'ASC',
      },
    });
  }

  public async findOne(where: any): Promise<DemandProgressEntity> {
    return this.demandProgressEntity.findOne({
      where,
      relations: ['creator', 'demand', 'user', 'demandNodeList'],
    });
  }

  public async findById(id: number): Promise<DemandProgressEntity> {
    return this.demandProgressEntity.findOne(id, {relations: ['creator', 'demand', 'user', 'demandNodeList']});
  }

  public async findByIds(ids?: number[]): Promise<DemandProgressEntity[]> {
    return this.demandProgressEntity.findByIds(ids, {
      relations: ['creator', 'demand', 'user', 'demandNodeList'],
      order: {
        id: 'ASC',
      },
    });
  }

  public async update(id: number, params: any = {}): Promise<UpdateResult> {
    return this.demandProgressEntity.update(id, params);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return this.demandProgressEntity.delete(id);
  }

  public async removeByIds(ids: DemandProgressEntity[]): Promise<DemandProgressEntity[]> {
    return this.demandProgressEntity.remove(ids);
  }

  public find(params?: {
    pageIndex?: number,
    pageSize?: number,
    demand?: number,
    user?: number,
  }): Promise<[DemandProgressEntity[], number]> {
    const skip = (params.pageIndex - 1) * params.pageSize;
    const where = {...params};
    delete where.pageIndex;
    delete where.pageSize;
    return this.demandProgressEntity.findAndCount({
      skip,
      take: params.pageSize,
      where,
      relations: ['creator', 'demand', 'user', 'demandNodeList'],
      order: {
        id: 'ASC',
      },
    });
  }
}
