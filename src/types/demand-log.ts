import { DemandLogType, DemandLogProperty } from '../dao/demand-log/demand-log.entity';

export class DemandLog {
  public id?: number;
  public type?: DemandLogType;
  public property?: DemandLogProperty;
  public oldDetail?: string;
  public newDetail?: string;
  public demand?: number;
  public creator?: number;
  public createDate?: Date;
}
