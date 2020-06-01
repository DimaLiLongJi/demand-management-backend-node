import { DemandPending } from 'src/dao/demand/demand.entity';

export type Timeout = '1' | '2' | '3' | '4';
export interface IDemandSearch {
  pageIndex: number;
  pageSize: number;
  keyword?: string;
  isOn?: '1' | '2';
  creator?: number;
  proposer?: number;
  broker?: number;
  devops?: number;
  developer?: number;
  approver?: number;
  demandType?: number;
  demandStatus?: number;
  timeout?: Timeout;
  deleteDate?: Date;
  demandCreateFromDate?: Date;
  demandCreateToDate?: Date;
  demandEndFromDate?: Date;
  demandEndToDate?: Date;
  scheduleStartFromDate?: Date;
  scheduleStartToDate?: Date;
  scheduleEndFromDate?: Date;
  scheduleEndToDate?: Date;
}

export type IDemandSelfSearchType = 'proposer' | 'broker' | 'devops' | 'developer' | 'creator' | 'approver';

export interface IDemandSelfSearch {
  pageIndex: number;
  pageSize: number;
  isOn?: '1' | '2';
  keyword?: string;
  type: IDemandSelfSearchType;
  demandType?: number;
  demandStatus?: number;
  timeout?: Timeout;
  deleteDate?: Date;
  demandCreateFromDate?: Date;
  demandCreateToDate?: Date;
  demandEndFromDate?: Date;
  demandEndToDate?: Date;
  scheduleStartFromDate?: Date;
  scheduleStartToDate?: Date;
  scheduleEndFromDate?: Date;
  scheduleEndToDate?: Date;
  userId?: number;
  isPending?: DemandPending;
}

export class Demand {
  public id?: number;
  public name?: string;
  public manDay?: number;
  public detail?: string;
  public comment?: string;
  public url?: string;
  public demandType?: number;
  public demandStatus?: number;
  public creator?: number;
  public proposerIds?: number[];
  public brokerIds?: number[];
  public developerIds?: number[];
  public devopsIds?: number[];
  public fileIds?: number[];
  public expectDate?: Date;
  public scheduleStartDate?: Date;
  public scheduleEndDate?: Date;
  public finishDate?: Date;
  public createDate?: Date;
  public updateDate?: Date;
  public deleteDate?: Date;
  public isOn?: '1' | '2';
  public isPending?: DemandPending;
}
