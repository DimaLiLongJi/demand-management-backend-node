import { Permission } from './permission';

export class User {
  public id?: number;
  public name?: string;
  public mobile?: string;
  public email?: string;
  public salt?: string;
  public password?: string;
  public role?: number;
  public creator?: number;
  public permissionIds?: number[];
  public permissionList?: Permission[];
  public createDate?: Date;
  public updateDate?: Date;
  public deleteDate?: Date;
  public isOn?: '1' | '2';
}
