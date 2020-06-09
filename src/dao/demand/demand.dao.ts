import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { DemandEntity } from './demand.entity';
import { IDemandSearch } from '../../types';

@Injectable()
export class DemandDAO {
  constructor(
    @InjectRepository(DemandEntity)
    private readonly demandRepository: Repository<DemandEntity>,
  ) { }

  public async save(demand: DemandEntity): Promise<DemandEntity> {
    return this.demandRepository.save(demand);
  }

  public async findAll(): Promise<DemandEntity[]> {
    return this.demandRepository.find({
      relations: [
        'creator',
        'fileList',
        'proposerList',
        'brokerList',
        'demandType',
        'demandStatus',
        'developerList',
        'devopsList',
        'demandProgressList',
        'demandProgressList.user',
        'demandProgressList.demand',
        'demandProgressList.demandNodeList',
      ],
      order: {
        id: 'ASC',
      },
    });
  }

  public async findOne(where: any): Promise<DemandEntity> {
    return this.demandRepository.findOne({
      where,
      relations: [
        'creator',
        'fileList',
        'proposerList',
        'brokerList',
        'demandType',
        'demandStatus',
        'developerList',
        'devopsList',
        'demandProgressList',
        'demandProgressList.user',
        'demandProgressList.demand',
        'demandProgressList.demandNodeList',
      ],
    });
  }

  public async findById(id: number): Promise<DemandEntity> {
    return this.demandRepository.findOne(id, {
      relations: [
        'creator',
        'fileList',
        'proposerList',
        'brokerList',
        'demandType',
        'demandStatus',
        'developerList',
        'devopsList',
        'demandProgressList',
        'demandProgressList.user',
        'demandProgressList.demand',
        'demandProgressList.demandNodeList',
      ],
    });
  }

  public async findByIds(ids?: number[]): Promise<DemandEntity[]> {
    return this.demandRepository.findByIds(ids, {
      relations: [
        'creator',
        'fileList',
        'proposerList',
        'brokerList',
        'demandType',
        'demandStatus',
        'developerList',
        'devopsList',
        'demandProgressList',
        'demandProgressList.user',
        'demandProgressList.demand',
        'demandProgressList.demandNodeList',
      ],
      order: {
        id: 'ASC',
      },
    });
  }

  public async update(id: number, params: any = {}): Promise<UpdateResult> {
    return this.demandRepository.update(id, params);
  }

  public find(where?: IDemandSearch): Promise<[DemandEntity[], number]> {
    console.log(33333333, where);
    const skip = (where.pageIndex - 1) * where.pageSize;

    let res = this.demandRepository.createQueryBuilder('demand')
      .leftJoinAndSelect('demand.demandType', 'demandType')
      .leftJoinAndSelect('demand.demandStatus', 'demandStatus')
      .leftJoinAndSelect('demand.demandProgressList', 'demandProgressList')
      .leftJoinAndSelect('demand.fileList', 'fileList');

    // 需求创建者
    if (where.creator) res = res.innerJoinAndSelect('demand.creator', 'creator', 'creator.id = :creatorId');
    else res = res.leftJoinAndSelect('demand.creator', 'creator');
    // 需求提出者
    if (where.proposer) res = res.innerJoinAndSelect('demand.proposerList', 'proposer', 'proposer.id = :proposerId');
    else res = res.leftJoinAndSelect('demand.proposerList', 'proposer');
    // 需求跟进人
    if (where.broker) res = res.innerJoinAndSelect('demand.brokerList', 'broker', 'broker.id = :brokerId');
    else res = res.leftJoinAndSelect('demand.brokerList', 'broker');
    // 开发者
    if (where.developer) res = res.innerJoinAndSelect('demand.developerList', 'developer', 'developer.id = :developerId');
    else res = res.leftJoinAndSelect('demand.developerList', 'developer');
    // 运维或其他
    if (where.devops) res = res.innerJoinAndSelect('demand.devopsList', 'devops', 'devops.id = :devopsId');
    else res = res.leftJoinAndSelect('demand.devopsList', 'devops');
    // 审核人
    if (where.approver) {
      res = res.innerJoinAndSelect('approver', 'approver', 'demand.demandTypeId = approver.demandTypeId AND demand.demandStatusId = approver.demandStatusId AND approver.userId = :approverId')
            // 审核人，必须为 isPending 2;
            .andWhere('demand.isPending = 2');
    }

    if (where.keyword) res = res.andWhere('demand.name LIKE :keyword')
      .orWhere('demand.detail LIKE :keyword');
    // 是否归档
    if (where.isOn === '1') res = res.andWhere('demand.delete_date  IS NULL');
    if (where.isOn === '2') res = res.andWhere('demand.delete_date IS NOT NULL');
    // 需求类型
    if (where.demandType) res = res.andWhere('demand.demandTypeId = :demandTypeId');
    // 需求状态
    if (where.demandStatus) res = res.andWhere('demand.demandStatusId = :demandStatusId');
    // 需求创建时间
    if (where.demandCreateFromDate) res = res.andWhere('TO_DAYS(demand.create_date) >= TO_DAYS(:demandCreateFromDate)');
    if (where.demandCreateToDate) res = res.andWhere('TO_DAYS(demand.create_date) <= TO_DAYS(:demandCreateToDate)');
    // 需求结束时间
    if (where.demandEndFromDate) res = res.andWhere('TO_DAYS(demand.finish_date) >= TO_DAYS(:demandEndFromDate)');
    if (where.demandEndToDate) res = res.andWhere('TO_DAYS(demand.finish_date) <= TO_DAYS(:demandEndToDate)');
    // 排期开始时间
    if (where.scheduleStartFromDate) res = res.andWhere('TO_DAYS(demand.schedule_start_date) >= TO_DAYS(:scheduleStartFromDate)');
    if (where.scheduleStartToDate) res = res.andWhere('TO_DAYS(demand.schedule_start_date) <= TO_DAYS(:scheduleStartToDate)');
    // 排期结束时间
    if (where.scheduleEndFromDate) res = res.andWhere('TO_DAYS(demand.schedule_end_date) >= TO_DAYS(:scheduleEndFromDate)');
    if (where.scheduleEndToDate) res = res.andWhere('TO_DAYS(demand.schedule_end_date) <= TO_DAYS(:scheduleEndToDate)');
    // 筛选过期状态
    if (where.timeout) {
      if (where.timeout === '1') res = res.andWhere('TO_DAYS(demand.schedule_end_date) > TO_DAYS(NOW())');
      if (where.timeout === '2') res = res.andWhere('TO_DAYS(demand.schedule_end_date) = TO_DAYS(NOW())');
      if (where.timeout === '3') res = res.andWhere('TO_DAYS(demand.schedule_end_date) < TO_DAYS(NOW())');
      if (where.timeout === '4') res = res.andWhere('demand.finish_date IS NOT NULL');
      else res = res.andWhere('demand.finish_date IS NULL');
    }

    res = res.setParameters({
      keyword: `%${where.keyword}%`,
      creatorId: where.creator,
      proposerId: where.proposer,
      brokerId: where.broker,
      developerId: where.developer,
      devopsId: where.devops,
      approverId: where.approver,
      demandTypeId: where.demandType,
      demandStatusId: where.demandStatus,
      demandCreateFromDate: new Date(where.demandCreateFromDate),
      demandCreateToDate: new Date(where.demandCreateToDate),
      demandEndFromDate: new Date(where.demandEndFromDate),
      demandEndToDate: new Date(where.demandEndToDate),
      scheduleStartFromDate: new Date(where.scheduleStartFromDate),
      scheduleStartToDate: new Date(where.scheduleStartToDate),
      scheduleEndFromDate: new Date(where.scheduleEndFromDate),
      scheduleEndToDate: new Date(where.scheduleEndToDate),
    });
    if (where.pageSize) res = res.skip(skip).take(where.pageSize);
    return res.orderBy('demand.id')
      .getManyAndCount();
  }
}
