import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DemandTypeStatusIndexEntity } from './demand-type-stataus-index.entity';

@Injectable()
export class DemandTypeStatusIndexDAO {
  constructor(
    @InjectRepository(DemandTypeStatusIndexEntity)
    private readonly repository: Repository<DemandTypeStatusIndexEntity>,
  ) {}

  public async save(demandTypeStatusIndex: DemandTypeStatusIndexEntity): Promise<DemandTypeStatusIndexEntity> {
    return this.repository.save(demandTypeStatusIndex);
  }

  public removeAll(list: DemandTypeStatusIndexEntity[]) {
    return this.repository.remove(list);
  }

  public async saveAll(list: DemandTypeStatusIndexEntity[]): Promise<DemandTypeStatusIndexEntity[]> {
    return this.repository.save(list);
  }

  public findByDemandTypeId(id: number): Promise<DemandTypeStatusIndexEntity[]> {
    return this.repository.find({
      where: {
        demandType: id,
      },
      relations: ['demandType', 'demandStatus'],
      order: {
        statusIndex: 'ASC',
      },
    });
  }
}
