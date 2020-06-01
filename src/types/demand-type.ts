import { DemandTypeEntity } from 'src/dao/demand-type/demand-type.entity';

export class DemandType {
  public id?: number;
  public name?: string;
  public demandStatusIds?: number[];
  public creator?: number;
  public createDate?: Date;
  public updateDate?: Date;
  public deleteDate?: Date;
  public isOn?: string;
  public approverList?: Array<{ demandStatusId: number,  approvers: number[] }>;
}

// tslint:disable-next-line: max-classes-per-file
export class DemandTypeWithApprover extends DemandTypeEntity {
  public approverList?: Array<{ demandStatusId: number,  approvers: number[] }>;
}
