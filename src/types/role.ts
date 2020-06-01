import { Permission } from './permission';
import { DemandType } from './demand-type';

export class Role {
  public id?: number;
  public name?: string;
  public permissionIds?: number[];
  public permissionList?: Permission[];
  public demandTypeIds?: number[];
  public demandTypeList?: DemandType[];
  public creator?: number;
  public createDate?: Date;
  public updateDate?: Date;
  public deleteDate?: Date;
  public isOn?: string;
}
