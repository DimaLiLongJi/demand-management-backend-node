import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { RoleEntity } from '../role/role.entity';
import { PermissionEntity } from '../permission/permission.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn('increment')
  public id: number;

  @Column()
  public name: string;

  @Column({ length: 11, unique: true })
  public mobile: string;

  @Column({ unique: true })
  public email: string;

  @Column()
  public salt?: string;

  @Column()
  public password?: string;

  @ManyToOne(type => RoleEntity, role => role.id)
  @JoinColumn({ name: 'roleId', referencedColumnName: 'id' })
  public role?: RoleEntity;

  @ManyToMany(type => PermissionEntity, permission => permission.id)
  @JoinTable({
    name: 'user_permission', // 此关系的联结表的表名
    joinColumn: {
      name: 'user',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission',
      referencedColumnName: 'id',
    },
  })
  public permissionList?: PermissionEntity[];

  @ManyToOne(type => UserEntity, user => user.id, {nullable: true})
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
