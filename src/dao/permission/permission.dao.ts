import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, FindOperator } from 'typeorm';
import { PermissionEntity } from './permission.entity';
import { Permission } from '../../types/index';

@Injectable()
export class PermissionDAO {
  constructor(
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
  ) {}

  public async save(permission: Permission): Promise<PermissionEntity> {
    return this.permissionRepository.save(permission as any);
  }

  public async update(id: number, params: any = {}): Promise<UpdateResult> {
    return this.permissionRepository.update(id, params);
  }

  public async findAll(): Promise<PermissionEntity[]> {
    return this.permissionRepository.find({
      relations: ['creator', 'module'],
      order: {
        id: 'ASC',
      },
    });
  }

  public async findOne(where: any): Promise<PermissionEntity> {
    return this.permissionRepository.findOne({
      where,
      relations: ['creator', 'module'],
    });
  }

  public async findById(id: number): Promise<PermissionEntity> {
    return this.permissionRepository.findOne(id, {relations: ['creator', 'module']});
  }

  public async findByIds(ids?: number[]): Promise<PermissionEntity[]> {
    return this.permissionRepository.findByIds(ids, {
      order: {
        id: 'ASC',
      },
    });
  }

  public async find(params?: {
    type?: '1' | '2',
    pageIndex?: number,
    pageSize?: number,
    deleteDate?: FindOperator<any> | Date,
  }): Promise<[PermissionEntity[], number]> {
    const skip = (params.pageIndex - 1) * params.pageSize;
    const where = {...params};
    if (!params.type) delete where.type;
    delete where.pageIndex;
    delete where.pageSize;
    return this.permissionRepository.findAndCount({
      skip,
      take: params.pageSize,
      where,
      relations: ['creator', 'module'],
      order: {
        id: 'ASC',
      },
    });
  }
}
