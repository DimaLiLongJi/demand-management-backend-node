import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { DemandProgressEntity } from '../demand-progress/demand-progress.entity';

@Entity('demand_node')
export class DemandNodeEntity {
  @PrimaryGeneratedColumn('increment')
  public id?: number;

  // 节点详情
  @Column({ type: 'varchar', nullable: true })
  public detail?: string;

  @ManyToOne(type => DemandProgressEntity, progress => progress.id, {nullable: false})
  @JoinColumn({name: 'demandProgressId', referencedColumnName: 'id'})
  public demandProgress?: DemandProgressEntity;

  @ManyToOne(type => UserEntity, user => user.id, { nullable: false })
  @JoinColumn({ name: 'creatorId', referencedColumnName: 'id' })
  public creator?: UserEntity;

  // 创建时间
  @CreateDateColumn({ name: 'create_date' })
  public createDate?: Date = new Date();

  @Column({ name: 'delete_date', type: 'datetime', nullable: true })
  public deleteDate?: Date = new Date();

  @Column({ name: 'finish_date', type: 'datetime', nullable: true })
  public finishDate?: Date = new Date();
}
