import { Injectable } from '@nestjs/common';
import { RoleEntity } from '../dao/role/role.entity';
import { RoleDAO } from '../dao/role/role.dao';
import { PermissionDAO } from '../dao/permission/permission.dao';
import { Role } from '../types';
import { IsNull, Not } from 'typeorm';
import { DemandTypeDAO } from '../dao/demand-type/demand-type.dao';

@Injectable()
export class RoleService {
  constructor(
    private readonly roleDAO: RoleDAO,
    private readonly permissionDAO: PermissionDAO,
    private readonly demandTypeDAO: DemandTypeDAO,
  ) {}

  public async create(role: Role): Promise<RoleEntity> {
    const createdRole: any = {
      name: role.name,
      creator: role.creator,
    };
    if (role.permissionIds) createdRole.permissionList = await this.permissionDAO.findByIds(role.permissionIds);
    if (role.demandTypeIds) createdRole.demandTypeList = await this.demandTypeDAO.findByIds(role.demandTypeIds);
    console.log('创建的角色', role);
    return this.roleDAO.save(createdRole);
  }

  public find(params?: {
    pageIndex?: number,
    pageSize?: number,
    isOn?: '1' | '2',
  }): Promise<[RoleEntity[], number]> {
    const where: any = {
      ...params,
    };
    if (where.isOn) delete where.isOn;
    if (params.isOn) where.deleteDate = (params.isOn === '1') ? IsNull() : Not(IsNull());
    return this.roleDAO.find(where);
  }

  public findById(id: number) {
    return this.roleDAO.findById(id);
  }

  public findByIds(ids?: number[]) {
    return this.roleDAO.findByIds(ids);
  }

  public async update(id: number, params?: Role) {
    const role = await this.roleDAO.findById(id);
    if (!role) return { success: false, message: `id 为 ${id} 的角色不存在` };
    if (!params) return { success: true, message: `id 为 ${id} 的角色更新成功` };
    try {
      const changeRole = {
        ... role,
        ...params,
      };
      if (params.permissionIds) changeRole.permissionList = await this.permissionDAO.findByIds(params.permissionIds);
      if (params.demandTypeIds) changeRole.demandTypeList = await this.demandTypeDAO.findByIds(params.demandTypeIds);
      if (params.isOn) {
        delete changeRole.deleteDate;
        delete changeRole.isOn;
        changeRole.deleteDate = (params.isOn === '1') ? null : new Date();
      }
      await this.roleDAO.save(changeRole as any);
      return { success: true, message: `id 为 ${id} 的角色更新成功` };
    } catch (e) {
      return { success: false, message:  `id 为 ${id} 的角色更新失败，原因：${e}` };
    }
  }
}
