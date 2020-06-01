import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ModuleEntity } from '../module/module.entity';

export enum PermissionType {
  route = '1',
  operating = '2',
}

@Entity('permission')
export class PermissionEntity {
  @PrimaryGeneratedColumn('increment')
  public id?: number;

  @Column({unique: true})
  public name?: string;

  /**
   * 权限类型 1 或 2
   * 1：访问权限，控制路由route
   * 2：操作权限控制，控制操作项operating
   *
   * @type {(1 | 2)}
   * @memberof PermissionEntity
   */
  @Column({
    type: 'enum',
    enum: PermissionType,
  })
  public type?: PermissionType;

  @Column({nullable: true, unique: true})
  public route?: string;

  @Column({nullable: true, unique: true})
  public operating?: string;

  @ManyToOne(type => ModuleEntity, mod => mod.id, {nullable: false})
  @JoinColumn({name: 'moduleId', referencedColumnName: 'id'})
  public module?: ModuleEntity;

  @ManyToOne(type => UserEntity, user => user.id, {nullable: false})
  @JoinColumn({ name: 'creatorId', referencedColumnName: 'id' })
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
