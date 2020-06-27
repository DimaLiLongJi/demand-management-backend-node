import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, FindOperator, DeleteResult } from 'typeorm';
import { DemandNodeEntity } from './demand-node.entity';

@Injectable()
export class DemandNodeDAO {
  constructor(
    @InjectRepository(DemandNodeEntity)
    private readonly demandNodeRepository: Repository<DemandNodeEntity>,
  ) {}

  public async save(demandType: DemandNodeEntity): Promise<DemandNodeEntity> {
    return this.demandNodeRepository.save(demandType);
  }

  public async delete(id: number): Promise<DeleteResult> {
    return this.demandNodeRepository.delete(id);
  }

  public async findAll(): Promise<DemandNodeEntity[]> {
    return this.demandNodeRepository.find({
      relations: ['creator'],
      order: {
        id: 'ASC',
      },
    });
  }

  public async findOne(where: any): Promise<DemandNodeEntity> {
    return this.demandNodeRepository.findOne({ where, relations: ['creator', 'demandProgress', 'demandProgress.demand', 'demandProgress.user'] });
  }

  public async findById(id: number): Promise<DemandNodeEntity> {
    return this.demandNodeRepository.findOne(id, {relations: ['creator', 'demandProgress', 'demandProgress.demand', 'demandProgress.user']});
  }

  public async findByIds(ids?: number[]): Promise<DemandNodeEntity[]> {
    return this.demandNodeRepository.findByIds(ids, {
      relations: ['creator'],
      order: {
        id: 'ASC',
      },
    });
  }

  public async update(id: number, params: any = {}): Promise<UpdateResult> {
    return this.demandNodeRepository.update(id, params);
  }

  public find(params?: {
    pageIndex?: number,
    pageSize?: number,
    user?: number,
    demandProgress?: number,
  }): Promise<[DemandNodeEntity[], number]> {
    const skip = (params.pageIndex - 1) * params.pageSize;
    const where = {...params};
    delete where.pageIndex;
    delete where.pageSize;
    return this.demandNodeRepository.findAndCount({
      skip,
      take: params.pageSize,
      where,
      relations: ['creator'],
      order: {
        id: 'ASC',
      },
    });
  }
}
