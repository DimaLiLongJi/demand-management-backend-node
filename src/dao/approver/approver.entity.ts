import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { DemandTypeEntity } from '../demand-type/demand-type.entity';
import { DemandStatusEntity } from '../demand-status/demand-status.entity';

@Entity('approver')
export class ApproverEntity {
  @PrimaryGeneratedColumn('increment')
  public id?: number;

  // 需求类型
  @ManyToOne(type => DemandTypeEntity, demandType => demandType.id, { nullable: false })
  @JoinColumn({ name: 'demandTypeId', referencedColumnName: 'id' })
  public demandType?: DemandTypeEntity;

  // 需求状态
  @ManyToOne(type => DemandStatusEntity, demandStatus => demandStatus.id, { nullable: false })
  @JoinColumn({ name: 'demandStatusId', referencedColumnName: 'id' })
  public demandStatus?: DemandStatusEntity;

  @ManyToOne(type => UserEntity, user => user.id, { nullable: false })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  public user?: UserEntity;
}
