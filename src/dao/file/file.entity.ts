import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';

export enum IsEndType {
  isNotEnd = '1',
  isEnd = '2',
}

@Entity('file')
export class FileEntity {
  @PrimaryGeneratedColumn('increment')
  public id?: number;

  @Column({ unique: true })
  public name?: string;

  @ManyToOne(type => UserEntity, user => user.id, { nullable: false })
  @JoinColumn({ name: 'creatorId', referencedColumnName: 'id' })
  public creator?: UserEntity;

  // 创建时间
  @CreateDateColumn({ name: 'create_date' })
  public createDate?: Date = new Date();
}
