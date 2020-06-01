import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, FindOperator } from 'typeorm';
import { DemandStatusEntity } from './demand-status.entity';

@Injectable()
export class DemandStatusDAO {
  constructor(
    @InjectRepository(DemandStatusEntity)
    private readonly demandStatusRepository: Repository<DemandStatusEntity>,
  ) {}

  public async save(demandStatus: DemandStatusEntity): Promise<DemandStatusEntity> {
    return this.demandStatusRepository.save(demandStatus);
  }

  public async findAll(): Promise<DemandStatusEntity[]> {
    return this.demandStatusRepository.find({
      relations: ['creator'],
      order: {
        id: 'ASC',
      },
    });
  }

  public async findOne(where: any): Promise<DemandStatusEntity> {
    return this.demandStatusRepository.findOne({
      where,
      relations: ['creator'],
    });
  }

  public async findById(id: number): Promise<DemandStatusEntity> {
    return this.demandStatusRepository.findOne(id, {relations: ['creator']});
  }

  public async findByIds(ids?: number[]): Promise<DemandStatusEntity[]> {
    return this.demandStatusRepository.findByIds(ids, {
      relations: ['creator'],
      order: {
        id: 'ASC',
      },
    });
  }

  public async update(id: number, params: any = {}): Promise<UpdateResult> {
    return this.demandStatusRepository.update(id, params);
  }

  public find(params?: {
    pageIndex?: number,
    pageSize?: number,
    deleteDate?: FindOperator<DemandStatusEntity> | Date,
  }): Promise<[DemandStatusEntity[], number]> {
    const skip = (params.pageIndex - 1) * params.pageSize;
    const where = {...params};
    delete where.pageIndex;
    delete where.pageSize;
    return this.demandStatusRepository.findAndCount({
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
