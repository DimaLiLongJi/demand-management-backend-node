import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { DemandStatusEntity } from '../demand-status/demand-status.entity';
import { DemandTypeEntity } from '../demand-type/demand-type.entity';

@Entity('demand_type_stataus_index')
export class DemandTypeStatusIndexEntity {
  @PrimaryGeneratedColumn('increment')
  public id?: number;

  @Column({ nullable: false ,  name: 'statusIndex' })
  public statusIndex?: number;

  @ManyToOne(type => DemandTypeEntity, demandType => demandType.id, { nullable: false })
  @JoinColumn({ name: 'demandTypeId', referencedColumnName: 'id' })
  public demandType?: DemandTypeEntity;

  @ManyToOne(type => DemandStatusEntity, demandStatus => demandStatus.id, { nullable: false })
  @JoinColumn({ name: 'demandStatusId', referencedColumnName: 'id' })
  public demandStatus?: DemandStatusEntity;
}
