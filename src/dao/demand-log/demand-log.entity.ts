import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { DemandEntity } from '../demand/demand.entity';

export enum DemandLogType {
  create = '1',
  update = '2',
  delete = '3',
  finish = '4', // 完成需求进度
  unfinish = '5', // 未完成需求进度
  updateProgressDate = '6', // 更新进度排期
  onUpper = '7', // 未归档需求
  onLower = '8', // 已归档需求
}

export enum DemandLogProperty {
  progress = 'progress',
  demand = 'demand',
  name = 'name',
  manDay = 'manDay',
  detail = 'detail',
  comment = 'comment',
  url = 'url',
  demandType = 'demandType',
  demandStatus = 'demandStatus',
  proposer = 'proposer',
  broker = 'broker',
  developer = 'developer',
  devops = 'devops',
  file = 'file',
  expectDate = 'expectDate',
  scheduleStartDate = 'scheduleStartDate',
  scheduleEndDate = 'scheduleEndDate',
  finishDate = 'finishDate',
  deleteDate = 'deleteDate',
  demandNode = 'demandNode',
  isPending = 'isPending',
}

@Entity('demand_log')
export class DemandLogEntity {
  @PrimaryGeneratedColumn('increment')
  public id?: number;

  /**
   * 类型 1 或 2
   * 1：新增
   * 2：更新
   * 3：删除
   *
   * @type {(1 | 2)}
   * @memberof DemandProgressType
   */
  @Column({
    type: 'enum',
    enum: DemandLogType,
  })
  public type?: DemandLogType;

  @Column()
  public property?: DemandLogProperty;

  @ManyToOne(type => DemandEntity, demand => demand.id, {nullable: false})
  @JoinColumn({name: 'demandId', referencedColumnName: 'id'})
  public demand?: DemandEntity;

  @Column({ type: 'varchar', length: '5000', nullable: true })
  public oldDetail?: string;

  @Column({ type: 'varchar', length: '5000', nullable: true })
  public newDetail?: string;

  @ManyToOne(type => UserEntity, user => user.id, { nullable: false })
  @JoinColumn({ name: 'creatorId', referencedColumnName: 'id' })
  public creator?: UserEntity;

  // 创建时间
  @CreateDateColumn({ name: 'create_date' })
  public createDate?: Date = new Date();
}
