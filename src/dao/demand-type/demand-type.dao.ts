import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, FindOperator } from 'typeorm';
import { DemandTypeEntity } from './demand-type.entity';

@Injectable()
export class DemandTypeDAO {
  constructor(
    @InjectRepository(DemandTypeEntity)
    private readonly demandTypeRepository: Repository<DemandTypeEntity>,
  ) {}

  public async save(demandType: DemandTypeEntity): Promise<DemandTypeEntity> {
    return this.demandTypeRepository.save(demandType);
  }

  public async findAll(): Promise<DemandTypeEntity[]> {
    return this.demandTypeRepository.find({
      relations: ['creator', 'demandStatusList'],
      order: {
        id: 'ASC',
      },
    });
  }

  public async findOne(where: any): Promise<DemandTypeEntity> {
    return this.demandTypeRepository.findOne({ where, relations: ['creator', 'demandStatusList'] });
  }

  public async findById(id: number): Promise<DemandTypeEntity> {
    return this.demandTypeRepository.findOne(id, {relations: ['creator', 'demandStatusList']});
  }

  public async findByIds(ids?: number[]): Promise<DemandTypeEntity[]> {
    return this.demandTypeRepository.findByIds(ids, {
      relations: ['creator', 'demandStatusList'],
      order: {
        id: 'ASC',
      },
    });
  }

  public async update(id: number, params: any = {}): Promise<UpdateResult> {
    return this.demandTypeRepository.update(id, params);
  }

  public find(params?: {
    pageIndex?: number,
    pageSize?: number,
    deleteDate?: FindOperator<any> | Date,
  }): Promise<[DemandTypeEntity[], number]> {
    const skip = (params.pageIndex - 1) * params.pageSize;
    const where = {...params};
    delete where.pageIndex;
    delete where.pageSize;
    return this.demandTypeRepository.findAndCount({
      skip,
      take: params.pageSize,
      where,
      relations: ['creator', 'demandStatusList'],
      order: {
        id: 'ASC',
      },
    });
  }
}
