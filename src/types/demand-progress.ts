import { DemandProgressType } from '../dao/demand-progress/demand-progress.entity';

export class DemandProgress {
  public id?: number;
  public demand: number;
  public user: number;
  public creator: number;
  public createDate?: Date;
  public updateDate?: Date;
  public finishDate?: Date;
  public scheduleStartDate?: Date;
  public scheduleEndDate?: Date;
  public finished?: '1' | '2';
  public type: DemandProgressType;
}
