import { Injectable } from '@nestjs/common';
import { DemandLogEntity } from '../dao/demand-log/demand-log.entity';
import { DemandLog } from '../types';
import { DemandLogDAO } from '../dao/demand-log/demand-log.dao';

@Injectable()
export class DemandLogService {
  constructor(
    private readonly demandLogDAO: DemandLogDAO,
  ) {}

  public async save(demandLog: DemandLog): Promise<DemandLogEntity> {
    console.log('创建的需求日志', demandLog);
    return this.demandLogDAO.save(demandLog as any);
  }

  public async saveAll(demandLogs: DemandLog[]) {
    console.log('创建的需求日志们', demandLogs);
    return this.demandLogDAO.saveAll(demandLogs);
  }

  public async find(params?: {
    demand?: number,
    creator?: number,
  }): Promise<[DemandLogEntity[], number]> {
    return this.demandLogDAO.find(params);
  }
}
