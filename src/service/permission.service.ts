import { Injectable } from '@nestjs/common';
import { PermissionEntity } from '../dao/permission/permission.entity';
import { Permission } from '../types';
import { IsNull, Not } from 'typeorm';
import { PermissionDAO } from '../dao/permission/permission.dao';

@Injectable()
export class PermissionService {
  constructor(
    private readonly permissionDAO: PermissionDAO,
  ) {}

  public async save(permission: Permission): Promise<PermissionEntity> {
    let createdPermission: Permission;
    if (permission.type === '1') {
      createdPermission = {
        name: permission.name,
        type: '1',
        route: permission.route,
        creator: permission.creator,
        module: permission.module,
      };
    } else {
      createdPermission = {
        name: permission.name,
        type: '2',
        operating: permission.operating,
        creator: permission.creator,
        module: permission.module,
      };
    }
    console.log('创建的权限', createdPermission);
    return this.permissionDAO.save(createdPermission);
  }

  public async update(id: number, params: any) {
    const permission = await this.permissionDAO.findById(id);
    if (!permission) return { success: false, message: `id 为 ${id} 的权限不存在` };
    try {
      if (params.isOn) {
        delete params.deleteDate;
        params.deleteDate = (params.isOn === '1') ? null : new Date();
        delete params.isOn;
      }
      await this.permissionDAO.update(id, params);
      return { success: true, message: `id 为 ${id} 的权限更新成功` };
    } catch (e) {
      return { success: false, message:  `id 为 ${id} 的权限更新失败，原因：${e}` };
    }
  }

  public findById(id: number) {
    return this.permissionDAO.findById(id);
  }

  public findByIds(ids?: number[]) {
    return this.permissionDAO.findByIds(ids);
  }

  public async find(params?: {
    type?: '1' | '2',
    pageIndex?: number,
    pageSize?: number,
    isOn?: '1' | '2',
  }): Promise<[PermissionEntity[], number]> {
    const where: any = {
      ...params,
    };
    if (where.isOn) delete where.isOn;
    if (params.isOn) {
      where.deleteDate = (params.isOn === '1') ? IsNull() : Not(IsNull());
    }
    return this.permissionDAO.find(where);
  }
}
