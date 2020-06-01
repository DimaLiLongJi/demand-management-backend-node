import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { DemandLogEntity } from './demand-log.entity';
import { DemandLog } from '../../types';

@Injectable()
export class DemandLogDAO {
  constructor(
    @InjectRepository(DemandLogEntity)
    private readonly demandLogRepository: Repository<DemandLogEntity>,
  ) {}

  public async save(demandLog: DemandLog): Promise<DemandLogEntity> {
    return this.demandLogRepository.save(demandLog as any);
  }

  public async saveAll(demandLog: DemandLog[]): Promise<DemandLogEntity[]> {
    return this.demandLogRepository.save(demandLog as any[]);
  }

  public async update(id: number, params: any = {}): Promise<UpdateResult> {
    return this.demandLogRepository.update(id, params);
  }

  public find(where: { demand?: number, creator?: number }): Promise<[DemandLogEntity[], number]> {
    return this.demandLogRepository.findAndCount({
      where,
      relations: ['demand', 'creator'],
      order: {
        id: 'ASC',
      },
    });
  }
}
