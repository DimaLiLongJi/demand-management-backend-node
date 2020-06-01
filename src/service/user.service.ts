import { Injectable } from '@nestjs/common';
import { UserEntity } from '../dao/user/user.entity';
import { UserDAO } from '../dao/user/user.dao';
import { PermissionDAO } from '../dao/permission/permission.dao';
import { ExcelService } from './excel.service';
import { User } from '../types';
import * as crypto from 'crypto';
import { IsNull, Not, Like } from 'typeorm';

@Injectable()
export class UserService {
  public static excelTitle = [
    'id',
    '角色名',
    '手机号',
    '邮箱',
    '角色',
    '权限',
    '创建者',
    '用户创建时间',
    '是否已归档',
  ];

  constructor(
    private readonly userDAO: UserDAO,
    private readonly permissionDAO: PermissionDAO,
    private readonly excelService: ExcelService,
  ) { }

  /**
   * 使用盐创建用户
   *
   * @param {User} user
   * @returns {Promise<UserEntity>}
   * @memberof UserService
   */
  public async create(user: User): Promise<UserEntity> {
    const salt = String((new Date()).getTime());
    const saltPassword = salt + ':' + user.password;
    const md5 = crypto.createHash('md5');
    const password = md5.update(saltPassword).digest('hex');
    const createdUser: User = {
      ...user,
      salt,
      password,
    };
    console.log('加盐前的密码：', user.password);
    console.log('盐：', salt);
    console.log('加盐后的密码：', password);
    if (user.permissionIds) createdUser.permissionList = await this.permissionDAO.findByIds(user.permissionIds) as any;
    return this.userDAO.save(createdUser);
  }

  public async findAll(): Promise<UserEntity[]> {
    return this.userDAO.findAll();
  }

  public async downLoad(params?: {
    isOn?: '1' | '2',
    keyword?: string,
  }): Promise<ArrayBuffer> {
    const data = (await this.find(params))[0];
    const excelRows = this.buildExcelRows(data);
    return this.excelService.buildExcel(UserService.excelTitle, excelRows);
  }

  private buildExcelRows(data: UserEntity[]): Array<Array<string | number | Date>> {
    return data.map(user => {
      return [
        user.id,
        user.name,
        user.mobile,
        user.email,
        user.role ? user.role.name : null,
        user.permissionList ? user.permissionList.map(per => per.name).toString() : null,
        user.creator.name,
        user.createDate,
        user.deleteDate ? '已归档' : '未归档',
      ];
    });
  }

  public find(params?: {
    pageIndex?: number,
    pageSize?: number,
    isOn?: '1' | '2',
    keyword?: string,
  }): Promise<[UserEntity[], number]> {
    const where: any = {
      ...params,
    };
    if (where.isOn) delete where.isOn;
    if (where.keyword) {
      delete where.keyword;
      where.name = Like(`%${params.keyword}%`);
    }
    if (params.isOn) where.deleteDate = (params.isOn === '1') ? IsNull() : Not(IsNull());
    return this.userDAO.find(where);
  }

  public findById(id: number) {
    return this.userDAO.findById(id);
  }

  public async update(id: number, params?: User) {
    const user = await this.userDAO.findById(id);
    if (!user) return { success: false, message: `id 为 ${id} 的用户不存在` };
    if (!params) return { success: true, message: `id 为 ${id} 的用户更新成功` };
    try {
      const changeUser: any = {
        ...user,
        ...params,
      };
      if (params.isOn) {
        changeUser.deleteDate = (params.isOn === '1') ? null : new Date();
        delete changeUser.isOn;
      }
      if (params.permissionIds) changeUser.permissionList = await this.permissionDAO.findByIds(params.permissionIds);
      await this.userDAO.save(changeUser as any);
      return { success: true, message: `id 为 ${id} 的用户更新成功` };
    } catch (e) {
      return { success: false, message: `id 为 ${id} 的用户更新失败，原因：${e}` };
    }
  }

  public async updatePassword(id: number, password: string) {
    const user = await this.userDAO.findById(id);
    if (!user) return { success: false, message: `id 为 ${id} 的用户不存在` };
    if (!password) return { success: true, message: `id 为 ${id} 的用户更新密码成功` };
    const salt = String((new Date()).getTime());
    const saltPassword = salt + ':' + password;
    const md5 = crypto.createHash('md5');
    const userPassword = md5.update(saltPassword).digest('hex');
    await this.userDAO.update(id, {
      salt,
      password: userPassword,
    });
    return { success: true, message: `id 为 ${id} 的用户更新密码成功` };
  }
}
