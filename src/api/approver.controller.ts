import { Controller, Get } from '@nestjs/common';
import { IResponse } from '../types';
import { ApproverService } from 'src/service/approver.service';
import { ApproverEntity } from 'src/dao/approver/approver.entity';

@Controller('/api/approver')
export class ApproverController {
  constructor(
    private readonly approverService: ApproverService,
  ) { }

  @Get('/all')
  public async getAll(): Promise<IResponse<ApproverEntity[]>> {
    try {
      const list = await this.approverService.findAll();
      return {
        success: true,
        message: '获取全部审批人成功',
        data: list,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }
}
