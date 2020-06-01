import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';

export enum IsEndType {
  isNotEnd = '1',
  isEnd = '2',
}

@Entity('demand_status')
export class DemandStatusEntity {
  @PrimaryGeneratedColumn('increment')
  public id?: number;

  @Column({ unique: true })
  public name?: string;

  /**
   * 是否是归档类型 '1' 或 '2'
   * '1'：未归档
   * '2'：归档
   *
   * @type {('1' | '2')}
   * @memberof DemandStatusEntity
   */
  @Column({
    type: 'enum',
    enum: IsEndType,
    default: IsEndType.isNotEnd,
  })
  public isEndStatus: IsEndType;

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
