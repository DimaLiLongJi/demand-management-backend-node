import { Injectable } from '@nestjs/common';
import { ModuleEntity } from '../dao/module/module.entity';
import { Module } from '../types';
import { ModuleDAO } from '../dao/module/module.dao';

@Injectable()
export class ModuleService {
  constructor(
    private readonly moduleDAO: ModuleDAO,
  ) {}

  public async save(mod: Module): Promise<ModuleEntity> {
    console.log('创建的模块', mod);
    return this.moduleDAO.save(mod);
  }

  public async findAll(): Promise<[ModuleEntity[], number]> {
    return this.moduleDAO.findAll();
  }
}
