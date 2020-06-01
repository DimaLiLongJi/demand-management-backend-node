import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ModuleEntity } from './module.entity';
import { Module } from '../../types/index';

@Injectable()
export class ModuleDAO {
  constructor(
    @InjectRepository(ModuleEntity)
    private readonly moduleRepository: Repository<ModuleEntity>,
  ) {}

  public async save(module: Module): Promise<ModuleEntity> {
    return this.moduleRepository.save(module as any);
  }

  public async findAll(): Promise<[ModuleEntity[], number]> {
    return this.moduleRepository.findAndCount({
      relations: ['creator', 'permissionList'],
      order: {
        id: 'ASC',
      },
    });
  }

  public async findOne(where: any): Promise<ModuleEntity> {
    return this.moduleRepository.findOne({
      where,
      relations: ['creator', 'permissionList'],
    });
  }

  public async findById(id: number): Promise<ModuleEntity> {
    return this.moduleRepository.findOne(id, {relations: ['creator', 'permissionList']});
  }
}
