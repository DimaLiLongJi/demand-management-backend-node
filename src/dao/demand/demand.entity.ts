import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToMany } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { FileEntity } from '../file/file.entity';
import { DemandTypeEntity } from '../demand-type/demand-type.entity';
import { DemandStatusEntity } from '../demand-status/demand-status.entity';
import { DemandProgressEntity } from '../demand-progress/demand-progress.entity';

export enum DemandPending {
  notPending = '1', // 已审核
  isPending = '2', // 待审核
}

@Entity('demand')
export class DemandEntity {
  @PrimaryGeneratedColumn('increment')
  public id?: number;

  @Column()
  public name?: string;

  // 需求是否正在等待审核
  @Column({ name: 'isPending', type: 'enum', enum: DemandPending, default: DemandPending.notPending })
  public isPending?: DemandPending;

  // 需求详情
  @Column({ type: 'varchar', length: '5000', nullable: true })
  public detail?: string;

  // 需求备注
  @Column({ type: 'varchar', length: '5000', nullable: true })
  public comment?: string;

  // 线上链接
  @Column({ nullable: true })
  public url?: string;

  // 开发人天
  @Column({type: 'int', nullable: true})
  public manDay?: number;

  // 需求类型
  @ManyToOne(type => DemandTypeEntity, demandType => demandType.id, { nullable: false })
  @JoinColumn({ name: 'demandTypeId', referencedColumnName: 'id' })
  public demandType?: DemandTypeEntity;

  // 需求状态
  @ManyToOne(type => DemandStatusEntity, demandStatus => demandStatus.id, { nullable: false })
  @JoinColumn({ name: 'demandStatusId', referencedColumnName: 'id' })
  public demandStatus?: DemandStatusEntity;

  // 需求创建者
  @ManyToOne(type => UserEntity, user => user.id, { nullable: false })
  @JoinColumn({ name: 'creatorId', referencedColumnName: 'id' })
  public creator?: UserEntity;

  @OneToMany(type => DemandProgressEntity, demandProgress => demandProgress.demand)
  public demandProgressList?: DemandProgressEntity[];

  // 需求提出人 不可为空
  @ManyToMany(type => UserEntity, user => user.id, { nullable: false })
  @JoinTable({
    name: 'demand_proposer', // 此关系的联结表的表名
    joinColumn: {
      name: 'demand',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user',
      referencedColumnName: 'id',
    },
  })
  public proposerList?: UserEntity[];

  // 需求对接人 可以为空
  @ManyToMany(type => UserEntity, user => user.id, { nullable: false })
  @JoinTable({
    name: 'demand_broker', // 此关系的联结表的表名
    joinColumn: {
      name: 'demand',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user',
      referencedColumnName: 'id',
    },
  })
  public brokerList?: UserEntity[];

  // 开发者列表
  @ManyToMany(type => UserEntity, user => user.id)
  @JoinTable({
    name: 'demand_developer', // 此关系的联结表的表名
    joinColumn: {
      name: 'demand',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user',
      referencedColumnName: 'id',
    },
  })
  public developerList?: UserEntity[];

  // 运维或其他人员列表
  @ManyToMany(type => UserEntity, user => user.id)
  @JoinTable({
    name: 'demand_devops', // 此关系的联结表的表名
    joinColumn: {
      name: 'demand',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user',
      referencedColumnName: 'id',
    },
  })
  public devopsList?: UserEntity[];

  // 附件列表
  @ManyToMany(type => FileEntity, file => file.id)
  @JoinTable({
    name: 'demand_files', // 此关系的联结表的表名
    joinColumn: {
      name: 'demand',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'file',
      referencedColumnName: 'id',
    },
  })
  public fileList?: FileEntity[];

  // 期待完成时间
  @Column({ name: 'expect_date', type: 'datetime', nullable: false })
  public expectDate?: Date = new Date();

  // 排期开始时间
  @Column({ name: 'schedule_start_date', type: 'datetime', nullable: true })
  public scheduleStartDate?: Date = new Date();

  // 排期结束时间
  @Column({ name: 'schedule_end_date', type: 'datetime', nullable: true })
  public scheduleEndDate?: Date = new Date();

  // 实际完成时间
  @Column({ name: 'finish_date', type: 'datetime', nullable: true })
  public finishDate?: Date = new Date();

  // 创建时间
  @CreateDateColumn({ name: 'create_date' })
  public createDate?: Date = new Date();

  // 修改时间
  @UpdateDateColumn({ name: 'update_date' })
  public updateDate?: Date = new Date();

  // 删除时间
  @Column({ name: 'delete_date', type: 'datetime', nullable: true })
  public deleteDate?: Date = new Date();
}
