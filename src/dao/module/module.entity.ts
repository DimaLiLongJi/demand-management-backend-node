import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { PermissionEntity } from '../permission/permission.entity';

@Entity('module')
export class ModuleEntity {
  @PrimaryGeneratedColumn('increment')
  public id?: number;

  @Column({unique: true})
  public name?: string;

  @Column({type: 'varchar', length: 255, nullable: false})
  public icon?: string;

  @OneToMany(type => PermissionEntity, permission => permission.module)
  public permissionList?: PermissionEntity[];

  @ManyToOne(type => UserEntity, user => user.id, {nullable: false})
  @JoinColumn({name: 'creatorId', referencedColumnName: 'id'})
  public creator?: UserEntity;

  // 创建时间
  @CreateDateColumn({ name: 'create_date' })
  public createDate?: Date = new Date();

  // 修改时间
  @UpdateDateColumn({ name: 'update_date' })
  public updateDate?: Date = new Date();

  @Column({name: 'delete_date', type: 'datetime', nullable: true})
  public deleteDate?: Date = new Date();
}
