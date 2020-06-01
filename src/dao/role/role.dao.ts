import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOperator } from 'typeorm';
import { RoleEntity } from './role.entity';

@Injectable()
export class RoleDAO {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) {}

  public async save(role: RoleEntity): Promise<RoleEntity> {
    return this.roleRepository.save(role);
  }

  public async findAll(): Promise<RoleEntity[]> {
    return this.roleRepository.find({
      relations: ['creator', 'permissionList', 'demandTypeList', 'demandTypeList.demandStatusList'],
      order: {
        id: 'ASC',
      },
    });
  }

  public async findById(id: number): Promise<RoleEntity> {
    return this.roleRepository.findOne(id, {relations: ['creator', 'permissionList', 'demandTypeList', 'demandTypeList.demandStatusList']});
  }

  public async findByIds(ids?: number[]): Promise<RoleEntity[]> {
    return this.roleRepository.findByIds(ids, {
      relations: ['creator', 'permissionList', 'demandTypeList'],
      order: {
        id: 'ASC',
      },
    });
  }

  public find(params?: {
    pageIndex?: number,
    pageSize?: number,
    deleteDate?: FindOperator<any> | Date,
  }): Promise<[RoleEntity[], number]> {
    const skip = (params.pageIndex - 1) * params.pageSize;
    const where = {...params};
    delete where.pageIndex;
    delete where.pageSize;
    return this.roleRepository.findAndCount({
      skip,
      take: params.pageSize,
      where,
      relations: ['creator', 'permissionList', 'demandTypeList', 'demandTypeList.demandStatusList'],
      order: {
        id: 'ASC',
      },
    });
  }
}
