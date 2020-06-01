import { Injectable } from '@nestjs/common';
import { DemandEntity, DemandPending } from '../dao/demand/demand.entity';
import { DemandProgressType } from '../dao/demand-progress/demand-progress.entity';
import { DemandDAO } from '../dao/demand/demand.dao';
import { UserDAO } from '../dao/user/user.dao';
import { DemandProgressDAO } from '../dao/demand-progress/demand-progress.dao';
import { DemandTypeDAO } from '../dao/demand-type/demand-type.dao';
import { DemandLogType, DemandLogProperty } from '../dao/demand-log/demand-log.entity';
import { DemandStatusDAO } from '../dao/demand-status/demand-status.dao';
import { IsEndType } from '../dao/demand-status/demand-status.entity';
import { DemandLogService } from './demand-log.service';
import { FileService } from './file.service';
import { ExcelService } from './excel.service';
import { EmailService } from './email.service';
import { Demand, IDemandSearch, DemandProgress, IDemandSelfSearch, DemandLog, File } from '../types';
import { UserEntity } from 'src/dao/user/user.entity';
import * as dayjs from 'dayjs';
import { ApproverService } from './approver.service';

@Injectable()
export class DemandService {
  public static excelTitle = [
    'id',
    '需求名',
    '创建人',
    '线上链接',
    '需求类型',
    '需求状态',
    '开发人天',
    '需求提出人',
    '需求对接人',
    '开发者',
    '运维或其他人员',
    '期望完成时间',
    '排期开始时间',
    '排期结束时间',
    '需求创建时间',
    '需求结束时间',
    '是否已归档',
    '需求详情',
    '审批备注',
  ];

  constructor(
    private readonly userDAO: UserDAO,
    private readonly demandDAO: DemandDAO,
    private readonly demandProgressDAO: DemandProgressDAO,
    private readonly demandStatusDAO: DemandStatusDAO,
    private readonly demandLogService: DemandLogService,
    private readonly demandTypeDAO: DemandTypeDAO,
    private readonly excelService: ExcelService,
    private readonly emailService: EmailService,
    private readonly fileService: FileService,
    private readonly approverService: ApproverService,
  ) { }

  public async create(demand: Demand): Promise<DemandEntity> {
    const createdDemand: any = { ...demand };
    if (demand.proposerIds) createdDemand.proposerList = await this.userDAO.findByIds(demand.proposerIds);
    if (demand.brokerIds) createdDemand.brokerList = await this.userDAO.findByIds(demand.brokerIds);
    if (demand.developerIds) createdDemand.developerList = await this.userDAO.findByIds(demand.developerIds);
    if (demand.devopsIds) createdDemand.devopsList = await this.userDAO.findByIds(demand.devopsIds);
    if (demand.fileIds) createdDemand.fileList = await this.fileService.findByIds(demand.fileIds);
    if (demand.demandStatus) {
      const demandStatusInfo = await this.demandStatusDAO.findById(demand.demandStatus);
      if (demandStatusInfo.isEndStatus === IsEndType.isEnd) createdDemand.finishDate = new Date();
      if (demandStatusInfo.isEndStatus === IsEndType.isNotEnd) createdDemand.finishDate = null;
      const approverList = await this.approverService.findByWhere({
        demandType: demand.demandType,
        demandStatus: demand.demandStatus,
      });

      // 如果是需求的类型和状态有审核的话，则为需求的isPending为待审核
      if (approverList.length > 0) createdDemand.isPending = DemandPending.isPending;
      else createdDemand.isPending = DemandPending.notPending;
    }
    delete createdDemand.proposerIds;
    delete createdDemand.brokerIds;
    delete createdDemand.developerIds;
    delete createdDemand.devopsIds;
    console.log('创建的需求:', createdDemand);
    const demandInfo = await this.demandDAO.save(createdDemand);
    // 创建需求进度
    const demandProgressList = [];
    if (demand.developerIds) {
      demand.developerIds.forEach(id => {
        demandProgressList.push({
          demand: demandInfo.id,
          user: id,
          creator: demand.creator,
          type: DemandProgressType.developer,
        });
      });
    }
    if (demand.devopsIds) {
      demand.devopsIds.forEach(id => {
        demandProgressList.push({
          demand: demandInfo.id,
          user: id,
          creator: demand.creator,
          type: DemandProgressType.devops,
        });
      });
    }
    if (demandProgressList.length > 0) {
      const progressList = await this.demandProgressDAO.createList(demandProgressList as any);
      const hasSendUser: number[] = [];
      // 给进度人发送邮件
      progressList.forEach(async (progress) => {
        if (hasSendUser.indexOf(progress.user as any) !== -1) return;
        hasSendUser.push(progress.user as any);
        await this.emailService.sendEmail((await this.userDAO.findById(progress.user as any)).email, {
          fromUserName: (await this.userDAO.findById(demand.creator)).name,
          demandId: demandInfo.id,
        });
      });
    }

    // 存创建日志
    const log = await this.demandLogService.save({
      creator: demand.creator,
      type: DemandLogType.create,
      demand: demandInfo.id,
      property: DemandLogProperty.demand,
      newDetail: [demandInfo.name].toString(),
    });
    console.log('创建的日志：', log);
    return demandInfo;
  }

  public async downLoad(params?: IDemandSearch): Promise<ArrayBuffer> {
    delete params.pageIndex;
    delete params.pageSize;
    const data = (await this.demandDAO.find(params))[0];
    const excelRows = this.buildExcelRows(data);
    return this.excelService.buildExcel(DemandService.excelTitle, excelRows);
  }

  public async addFile(
    file: {
      fieldname: string,
      originalname: string,
      encoding: string,
      mimetype: string,
      buffer: Buffer,
      size: number,
    },
    updaterId: number,
    demandId?: number,
  ) {
    const createdFile: File = {};
    createdFile.name = this.fileService.writeFile(file);
    createdFile.creator = updaterId;
    const addFile = await this.fileService.create(createdFile);

    if (!demandId) return addFile;

    const demand = await this.demandDAO.findById(demandId);
    if (!demand) return { success: false, message: `id 为 ${demandId} 的需求不存在` };
    if (!file) return { success: true, message: `id 为 ${demandId} 的需求增加附件成功` };

    const updatedDemand: any = { ...demand };
    delete updatedDemand.creator; // 创建者不能改，要删了草

    if (!demand.fileList) updatedDemand.fileList = [addFile];
    else updatedDemand.fileList = [...demand.fileList, addFile];

    await this.demandDAO.save(updatedDemand);

    const log = await this.demandLogService.save({
      creator: updaterId,
      type: DemandLogType.create,
      demand: demandId,
      property: DemandLogProperty.file,
      newDetail: addFile.name,
    });
    console.log('创建附件的日志：', log);
    return addFile;
  }

  public async deleteFile(id: number, fileId: number, updaterId: number) {
    const demand = await this.demandDAO.findById(id);
    if (!demand) return { success: false, message: `id 为 ${id} 的需求不存在` };
    if (!fileId) return { success: true, message: `id 为 ${id} 的需求删除附件成功` };

    const updatedDemand: any = { ...demand };
    delete updatedDemand.creator; // 创建者不能改，要删了草

    try {
      const deleteFile = await this.fileService.findById(fileId);
      if (!deleteFile) return { success: true, message: `id 为 ${id} 的需求删除附件成功` };

      if (!demand.fileList) return { success: true, message: `id 为 ${id} 的需求删除附件成功` };
      else updatedDemand.fileList = [...demand.fileList.filter(file => file.id !== fileId)];

      await this.demandDAO.save(updatedDemand);

      await this.demandLogService.save({
        creator: updaterId,
        type: DemandLogType.delete,
        demand: id,
        property: DemandLogProperty.file,
        newDetail: deleteFile.name,
      });

      return { success: true, message: `id 为 ${id} 的需求附件更新成功` };
    } catch (e) {
      return { success: false, message: e};
    }
  }

  public async find(params?: IDemandSearch): Promise<[DemandEntity[], number]> {
    return this.demandDAO.find(params);
  }

  public async findSelf(params?: IDemandSelfSearch): Promise<[DemandEntity[], number]> {
    const searchParams: any = {
      ...params,
    };
    if (params.type === 'creator') searchParams.creator = params.userId;
    if (params.type === 'proposer') searchParams.proposer = params.userId;
    if (params.type === 'broker') searchParams.broker = params.userId;
    if (params.type === 'developer') searchParams.developer = params.userId;
    if (params.type === 'devops') searchParams.devops = params.userId;
    if (params.type === 'approver') searchParams.approver = params.userId;
    delete params.type;
    delete params.userId;
    return this.demandDAO.find(searchParams);
  }

  public findById(id: number) {
    return this.demandDAO.findById(id);
  }

  public findByIds(ids?: number[]) {
    return this.demandDAO.findByIds(ids);
  }

  public async update(id: number, params: Demand = {}) {
    const demand = await this.demandDAO.findById(id);
    if (!demand) return { success: false, message: `id 为 ${id} 的需求不存在` };
    if (!params) return { success: true, message: `id 为 ${id} 的需求更新成功` };
    try {
      const updatedDemand: any = { ...demand, ...params };
      delete updatedDemand.creator; // 创建者不能改，要删了草

      // 如果要审核权限，则判断下是否有审核需求的权限
      if (params.isPending) {
        const hasApprover = await this.approverService.findByWhere({
          demandType: demand.demandType.id,
          demandStatus: demand.demandStatus.id,
          user: params.creator,
        });
        if (!hasApprover) return { success: false, message: `id 为 ${id} 的需求无法审核，原因：id为 ${params.creator} 的用户无审核权限！` };
      }

      if (params.proposerIds) updatedDemand.proposerList = await this.userDAO.findByIds(params.proposerIds);
      if (params.brokerIds) updatedDemand.brokerList = await this.userDAO.findByIds(params.brokerIds);
      if (params.developerIds) updatedDemand.developerList = await this.userDAO.findByIds(params.developerIds);
      if (params.devopsIds) updatedDemand.devopsList = await this.userDAO.findByIds(params.devopsIds);
      if (params.demandStatus) {
        const demandStatusInfo = await this.demandStatusDAO.findById(params.demandStatus);
        if (demandStatusInfo.isEndStatus === IsEndType.isEnd) updatedDemand.finishDate = new Date();
        if (demandStatusInfo.isEndStatus === IsEndType.isNotEnd) updatedDemand.finishDate = null;
        const approverList = await this.approverService.findByWhere({
          demandType: demand.demandType.id,
          demandStatus: params.demandStatus,
        });
        // 如果是需求的类型和状态有审核的话，则为需求的isPending为待审核
        if (approverList.length > 0) updatedDemand.isPending = DemandPending.isPending;
        else updatedDemand.isPending = DemandPending.notPending;
      }
      if (params.isOn) {
         delete updatedDemand.deleteDate;
         delete updatedDemand.isOn;
         updatedDemand.deleteDate = (params.isOn === '1') ? null : new Date();
         // 主要提供归档日志
         params.deleteDate = (params.isOn === '1') ? null : new Date();
      }
      delete updatedDemand.proposerIds;
      delete updatedDemand.brokerIds;
      delete updatedDemand.developerIds;
      delete updatedDemand.devopsIds;
      const demandInfo = await this.demandDAO.save(updatedDemand);

      await this.diffProgressList(demandInfo, params.creator, params.developerIds, params.devopsIds);
      await this.diff4Log(demand, params);

      return { success: true, message: `id 为 ${id} 的需求更新成功` };
    } catch (e) {
      return { success: false, message: `id 为 ${id} 的需求更新失败，原因：${e}` };
    }
  }

  private userIdListIsChanged(newList: number[] = [], userList: UserEntity[] = []): boolean {
    const newUserList = newList || [];
    const userIdList = userList ? userList.map(user => user.id) : [];
    return newUserList.sort().toString() === userIdList.sort().toString();
  }

  private async diff4Log(demandInfo: DemandEntity, params: Demand = {}) {
    const logList: DemandLog[] = [];
    if (!params) return;
    if (params.brokerIds && !this.userIdListIsChanged(params.brokerIds, demandInfo.brokerList)) {
      const oldDetail = demandInfo.brokerList ? demandInfo.brokerList.map(user => user.name).toString() : null;
      const newUsers = await this.userDAO.findByIds(params.brokerIds);
      const newDetail = newUsers ? newUsers.map(user => user.name).toString() : null;
      logList.push({
        creator: params.creator,
        type: DemandLogType.update,
        demand: demandInfo.id,
        property: DemandLogProperty.broker,
        oldDetail,
        newDetail,
      });
    }
    if (params.developerIds && !this.userIdListIsChanged(params.developerIds, demandInfo.developerList)) {
      const oldDetail = demandInfo.developerList ? demandInfo.developerList.map(user => user.name).toString() : null;
      const newUsers = await this.userDAO.findByIds(params.developerIds);
      const newDetail = newUsers ? newUsers.map(user => user.name).toString() : null;
      logList.push({
        creator: params.creator,
        type: DemandLogType.update,
        demand: demandInfo.id,
        property: DemandLogProperty.developer,
        oldDetail,
        newDetail,
      });
    }
    if (params.devopsIds && !this.userIdListIsChanged(params.devopsIds, demandInfo.devopsList)) {
      const oldDetail = demandInfo.devopsList ? demandInfo.devopsList.map(user => user.name).toString() : null;
      const newUsers = await this.userDAO.findByIds(params.devopsIds);
      const newDetail = newUsers ? newUsers.map(user => user.name).toString() : null;
      logList.push({
        creator: params.creator,
        type: DemandLogType.update,
        demand: demandInfo.id,
        property: DemandLogProperty.devops,
        oldDetail,
        newDetail,
      });
    }
    if (params.proposerIds && !this.userIdListIsChanged(params.proposerIds, demandInfo.proposerList)) {
      const oldDetail = demandInfo.proposerList ? demandInfo.proposerList.map(user => user.name).toString() : null;
      const newUsers = await this.userDAO.findByIds(params.proposerIds);
      const newDetail = newUsers ? newUsers.map(user => user.name).toString() : null;
      logList.push({
        creator: params.creator,
        type: DemandLogType.update,
        demand: demandInfo.id,
        property: DemandLogProperty.proposer,
        oldDetail,
        newDetail,
      });
    }
    if (params.name && params.name !== demandInfo.name) {
      logList.push(this.buildCommonUpdate(
        'name',
        params.creator, demandInfo.id,
        demandInfo.name, params.name,
      ));
    }
    if (params.isPending && params.isPending !== demandInfo.isPending) {
      logList.push(this.buildCommonUpdate(
        'isPending',
        params.creator, demandInfo.id,
        demandInfo.isPending === DemandPending.isPending ? '待审核' : '已审核', params.isPending === DemandPending.isPending ? '待审核' : '已审核',
      ));
    }
    if (params.expectDate && !dayjs(params.expectDate).isSame(dayjs(demandInfo.expectDate))) {
      logList.push(this.buildCommonUpdate(
        'expectDate',
        params.creator, demandInfo.id,
        demandInfo.expectDate, new Date(params.expectDate),
      ));
    }
    if (params.demandType && params.demandType !== demandInfo.demandType.id) logList.push(
      this.buildCommonUpdate(
        'demandType',
        params.creator, demandInfo.id,
        demandInfo.demandType.name, (await this.demandTypeDAO.findById(params.demandType)).name,
      ));
    if (params.demandStatus && params.demandStatus !== demandInfo.demandStatus.id) logList.push(
      this.buildCommonUpdate(
        'demandStatus', params.creator, demandInfo.id,
        demandInfo.demandStatus.name,
        (await this.demandStatusDAO.findById(params.demandStatus)).name,
      ),
    );
    if (params.manDay && params.manDay !== demandInfo.manDay) logList.push(
      this.buildCommonUpdate(
        'manDay',
        params.creator, demandInfo.id,
        demandInfo.manDay, params.manDay,
      ),
    );
    if (params.scheduleStartDate && !dayjs(params.scheduleStartDate).isSame(dayjs(demandInfo.scheduleStartDate))) {
      logList.push(this.buildCommonUpdate(
        'scheduleStartDate',
        params.creator, demandInfo.id,
        demandInfo.scheduleStartDate, new Date(params.scheduleStartDate),
      ));
    }
    if (params.scheduleEndDate && !dayjs(params.scheduleEndDate).isSame(dayjs(demandInfo.scheduleEndDate))) {
      logList.push(this.buildCommonUpdate(
        'scheduleEndDate', params.creator, demandInfo.id,
        demandInfo.scheduleEndDate, new Date(params.scheduleEndDate),
      ));
    }
    if (params.detail !== null && params.detail !== undefined && params.detail !== demandInfo.detail) logList.push(
      this.buildCommonUpdate(
        'detail', params.creator, demandInfo.id, demandInfo.detail,
        params.detail,
      ),
    );
    if (params.comment !== null && params.comment !== undefined && params.comment !== demandInfo.comment) logList.push(
      this.buildCommonUpdate(
        'comment', params.creator, demandInfo.id, demandInfo.comment,
        params.comment,
      ),
    );
    if (params.url !== null && params.url !== undefined && params.url !== demandInfo.url) logList.push(
      this.buildCommonUpdate(
        'url', params.creator, demandInfo.id,
        demandInfo.url, params.url,
      ),
    );
    // 删除日期空为未归档子，有删除日期已归档
    if (params.deleteDate === null || params.deleteDate) {
      logList.push({
        creator: params.creator,
        type: params.deleteDate === null ? DemandLogType.onUpper : DemandLogType.onLower,
        demand: demandInfo.id,
        property: DemandLogProperty.demand,
      });
    }
    if (logList.length > 0) await this.demandLogService.saveAll(logList);
  }

  private buildCommonUpdate(property: string, creatorId: number, damandId: number, oldDetail: any, newDetail: any) {
    return {
      creator: creatorId,
      type: DemandLogType.update,
      demand: damandId,
      property: DemandLogProperty[property],
      oldDetail,
      newDetail,
    };
  }

  private async diffProgressList(demandInfo: DemandEntity, creatorId: number, developerIds?: number[], devopsIds?: number[]) {
    const addDemandProgressList: DemandProgress[] = [];
    // const deleteDemandProgressList: number[] = [];
    // 添加需求开发进度
    if (developerIds) {
      developerIds.forEach(userId => {
        if (!demandInfo.demandProgressList) {
          addDemandProgressList.push({
            demand: demandInfo.id,
            user: userId,
            creator: creatorId,
            type: DemandProgressType.developer,
          });
          return;
        }
        if (!demandInfo.demandProgressList.find(p => {
          return p.user.id === userId && p.demand.id === demandInfo.id && p.type === DemandProgressType.developer;
        })) {
          addDemandProgressList.push({
            demand: demandInfo.id,
            user: userId,
            creator: creatorId,
            type: DemandProgressType.developer,
          });
        }
      });
    }
    // 添加需求运维或其他进度
    if (devopsIds) {
      devopsIds.forEach(userId => {
        if (!demandInfo.demandProgressList) {
          addDemandProgressList.push({
            demand: demandInfo.id,
            user: userId,
            creator: creatorId,
            type: DemandProgressType.devops,
          });
          return;
        }
        if (!demandInfo.demandProgressList.find(p => {
          return p.user.id === userId && p.demand.id === demandInfo.id && p.type === DemandProgressType.devops;
        })) {
          addDemandProgressList.push({
            demand: demandInfo.id,
            user: userId,
            creator: creatorId,
            type: DemandProgressType.devops,
          });
        }
      });
    }
    // 旧进度在新进度中没有的则删除
    // if (demandInfo.demandProgressList) {
    //   demandInfo.demandProgressList.forEach(p => {
    //     if (p.type === DemandProgressType.developer) {
    //       if (!developerIds) return;
    //       if (!developerIds.find(userId => userId === p.user.id)) {
    //         deleteDemandProgressList.push(p.id);
    //       }
    //     }
    //     if (p.type === DemandProgressType.devops) {
    //       if (!devopsIds) return;
    //       if (!devopsIds.find(userId => userId === p.user.id)) {
    //         deleteDemandProgressList.push(p.id);
    //       }
    //     }
    //   });
    // }

    if (addDemandProgressList.length > 0) {
      await this.demandProgressDAO.createList(addDemandProgressList as any);
      const hasSendUser: number[] = [];
      addDemandProgressList.forEach(async (progress) => {
        if (hasSendUser.indexOf(progress.user) !== -1) return;
        hasSendUser.push(progress.user);
        // 发送邮件
        await this.emailService.sendEmail((await this.userDAO.findById(progress.user)).email, {
          fromUserName: (await this.userDAO.findById(creatorId)).name,
          demandId: demandInfo.id,
        });
      });
    }
    // if (deleteDemandProgressList.length > 0) {
    //   const deleteDemandProgressListRes = await this.demandProgressDAO.findByIds(deleteDemandProgressList);
    //   await this.demandProgressDAO.removeByIds(deleteDemandProgressListRes);
    // }
  }

  private buildExcelRows(data: DemandEntity[]): Array<Array<string | number | Date>> {
    return data.map(demand => {
      return [
        demand.id,
        demand.name,
        demand.creator.name,
        demand.url,
        demand.demandType.name,
        demand.demandStatus.name,
        demand.manDay,
        demand.proposerList ? demand.proposerList.map(user => user.name).toString() : null,
        demand.brokerList ? demand.brokerList.map(user => user.name).toString() : null,
        demand.developerList ? demand.developerList.map(user => user.name).toString() : null,
        demand.devopsList ? demand.devopsList.map(user => user.name).toString() : null,
        demand.expectDate,
        demand.scheduleStartDate,
        demand.scheduleEndDate,
        demand.createDate,
        demand.finishDate,
        demand.deleteDate ? '已归档' : '未归档',
        demand.detail,
        demand.comment,
      ];
    });
  }
}
