import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOperator, UpdateResult } from 'typeorm';
import { UserEntity } from './user.entity';
import { User } from '../../types/index';

@Injectable()
export class UserDAO {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async save(user: User): Promise<UserEntity> {
    return this.userRepository.save(user as any);
  }

  public async findAll(): Promise<UserEntity[]> {
    return this.userRepository.find({
      relations: ['creator', 'role', 'permissionList'],
      order: {
        id: 'ASC',
      },
    });
  }

  public async find(params?: {
    pageIndex?: number,
    pageSize?: number,
    deleteDate?: FindOperator<any> | Date,
    name?: FindOperator<string>,
  }) {
    const skip = (params.pageIndex - 1) * params.pageSize;
    const where = {...params};
    delete where.pageIndex;
    delete where.pageSize;
    return this.userRepository.findAndCount({
      skip,
      take: params.pageSize,
      where,
      relations: ['creator', 'role', 'role.permissionList', 'permissionList'],
      order: {
        id: 'ASC',
      },
    });
  }

  public async findById(id: number): Promise<UserEntity> {
    return this.userRepository.findOne(id, {relations: ['creator', 'role', 'permissionList']});
  }

  public async findByIds(ids?: number[]): Promise<UserEntity[]> {
    return this.userRepository.findByIds(ids, {
      relations: ['creator', 'role', 'permissionList'],
      order: {
        id: 'ASC',
      },
    });
  }

  public async findOne(where: User): Promise<UserEntity> {
    return this.userRepository.findOne({
      where,
      relations: ['creator', 'role', 'permissionList'],
    });
  }

  public async findByMobileOrEmail(where: {mobile?: string, email?: string}): Promise<UserEntity> {
    return this.userRepository.findOne({
      where,
      relations: ['creator', 'role', 'role.permissionList', 'role.permissionList.module', 'permissionList', 'permissionList.module'],
    });
  }

  public async update(id: number, params: any = {}): Promise<UpdateResult> {
    return this.userRepository.update(id, params);
  }
}
