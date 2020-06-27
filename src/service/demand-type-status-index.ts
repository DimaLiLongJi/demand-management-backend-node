import { Injectable } from '@nestjs/common';
import { DemandTypeStatusIndexDAO } from '../dao/demand-type-stataus-index/demand-type-stataus-index.dao';
import { DemandTypeStatusIndexEntity } from '../dao/demand-type-stataus-index/demand-type-stataus-index.entity';
import { IDemandTypeStatusIndex } from '../types/demand-type-stataus-index';

@Injectable()
export class DemandTypeStatusIndexService {
  constructor(
    private dao: DemandTypeStatusIndexDAO,
  ) { }

  public create(demandTypeStatusIndex: IDemandTypeStatusIndex): Promise<DemandTypeStatusIndexEntity> {
    return this.dao.save(demandTypeStatusIndex as any);
  }

  public findByDemandTypeId(id: number): Promise<DemandTypeStatusIndexEntity[]> {
    return this.dao.findByDemandTypeId(id);
  }

  public async createIndexList(demandTypeId: number, list: IDemandTypeStatusIndex[]): Promise<DemandTypeStatusIndexEntity[]> {
    const oldList = await this.dao.findByDemandTypeId(demandTypeId);
    if (oldList && oldList.length > 0) {
      await this.dao.removeAll(oldList);
    }
    return this.dao.saveAll(list as any);
  }

}
