import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { DemandStatusEntity } from '../demand-status/demand-status.entity';

@Entity('demand_type')
export class DemandTypeEntity {
  @PrimaryGeneratedColumn('increment')
  public id?: number;

  @Column({ unique: true })
  public name?: string;

  @ManyToMany(type => DemandStatusEntity, demandStatus => demandStatus.id)
  @JoinTable({
    name: 'demand_type_demand_status', // 此关系的联结表的表名
    joinColumn: {
      name: 'demand_type',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'demand_status',
      referencedColumnName: 'id',
    },
  })
  public demandStatusList?: DemandStatusEntity[];

  @ManyToOne(type => UserEntity, user => user.id, { nullable: false })
  @JoinColumn({ name: 'creatorId', referencedColumnName: 'id' })
  public creator?: UserEntity;

  // 创建时间
  @CreateDateColumn({ name: 'create_date' })
  public createDate?: Date = new Date();

  // 修改时间
  @UpdateDateColumn({ name: 'update_date' })
  public updateDate?: Date = new Date();

  @Column({ name: 'delete_date', type: 'datetime', nullable: true })
  public deleteDate?: Date = new Date();
}
