import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { DemandEntity } from '../demand/demand.entity';
import { DemandNodeEntity } from '../demand-node/demand-node.entity';

export enum DemandProgressType {
  developer = '1',
  devops = '2',
}

@Entity('demand_progress')
export class DemandProgressEntity {
  @PrimaryGeneratedColumn('increment')
  public id?: number;

  /**
   * 类型 '1' 或 '2'
   * '1'：开发进度
   * '2'：运维或其他进度
   *
   * @type {('1' | '2')}
   * @memberof DemandProgressType
   */
  @Column({
    type: 'enum',
    enum: DemandProgressType,
  })
  public type?: DemandProgressType;

  @ManyToOne(type => DemandEntity, demand => demand.id, {nullable: false})
  @JoinColumn({name: 'demandId', referencedColumnName: 'id'})
  public demand?: DemandEntity;

  @OneToMany(type => DemandNodeEntity, demandProgress => demandProgress.demandProgress)
  public demandNodeList?: DemandNodeEntity[];

  @ManyToOne(type => UserEntity, user => user.id, { nullable: false })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  public user?: UserEntity;

  @ManyToOne(type => UserEntity, user => user.id, { nullable: false })
  @JoinColumn({ name: 'creatorId', referencedColumnName: 'id' })
  public creator?: UserEntity;

  // 创建时间
  @CreateDateColumn({ name: 'create_date' })
  public createDate?: Date = new Date();

  // 修改时间
  @UpdateDateColumn({ name: 'update_date' })
  public updateDate?: Date = new Date();

  // 排期开始时间
  @Column({ name: 'schedule_start_date', type: 'datetime', nullable: true })
  public scheduleStartDate?: Date = new Date();

  // 排期结束时间
  @Column({ name: 'schedule_end_date', type: 'datetime', nullable: true })
  public scheduleEndDate?: Date = new Date();

  @Column({ name: 'finish_date', type: 'datetime', nullable: true })
  public finishDate?: Date = new Date();
}
