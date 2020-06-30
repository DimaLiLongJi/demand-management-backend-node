import { Controller, Get, Body, Post, Query, Put, Param, Req, Header, Res, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DemandService } from '../service/demand.service';
import { IResponse, Demand, IDemandSearch, IDemandSelfSearch } from '../types';
import { DemandEntity, DemandPending } from '../dao/demand/demand.entity';
import { Request, Response } from 'express';
import * as dayjs from 'dayjs';

@Controller('/api/demand')
export class DemandController {
  constructor(
    private readonly demandService: DemandService,
  ) { }

  @Post('/addFile')
  @Header('Content-Type', 'multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  public async addFile(
    @Req() req: Request,
    @UploadedFile() file: {
      fieldname: string,
      originalname: string,
      encoding: string,
      mimetype: string,
      buffer: Buffer,
      size: number,
    },
    @Body() body?: { demandId?: number },
  ) {
    try {
      const demandInfo = await this.demandService.addFile(file, Number(req.headers.authId), body.demandId);
      return {
        success: true,
        message: '创建需求附件成功',
        data: demandInfo,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  @Post('/')
  public async create(
    @Body() demand: Demand,
    @Req() req: Request,
  ): Promise<IResponse<DemandEntity>> {
    try {
      demand.creator = Number(req.headers.authId);
      const demandInfo = await this.demandService.create(demand);
      return {
        success: true,
        message: '创建需求成功',
        data: demandInfo,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  @Get('/find')
  public async find(
    @Query() params?: IDemandSearch,
  ): Promise<IResponse<[DemandEntity[], number]>> {
    try {
      const demandList = await this.demandService.find(params);
      return {
        success: true,
        message: '获取本人需求列表成功',
        data: demandList,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  @Get('/download')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  public async download(
    @Res() res: Response,
    @Query() params?: IDemandSearch,
  ): Promise<void> {
    try {
      const excel = await this.demandService.downLoad(params);
      res.attachment(`需求列表_${dayjs().format('YYYY年MM月DD日HH:mm:ss')}.xlsx`);
      res.send(excel);
    } catch (e) {
      console.error('下载需求列表失败', e);
      res.status(404).end(JSON.stringify({
        success: false,
        message: e,
      }));
    }
  }

  @Get('/find-self')
  public async findSelf(
    @Req() req: Request,
    @Query() params?: IDemandSelfSearch,
  ): Promise<IResponse<[DemandEntity[], number]>> {
    try {
      params.userId = Number(req.headers.authId);
      const demandList = await this.demandService.findSelf(params);
      return {
        success: true,
        message: '获取个人需求列表成功',
        data: demandList,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  @Get(':id')
  public async getById(
    @Param('id') id: number,
  ): Promise<IResponse<DemandEntity>> {
    try {
      const demandInfo = await this.demandService.findById(id);
      return {
        success: true,
        message: `获取id为${id}的需求成功`,
        data: demandInfo,
      };
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  @Put('/pass/:id')
  public async pass(
    @Param('id') id: number,
    @Req() req: Request,
  ) {
    const demand: Demand = {
      creator: Number(req.headers.authId),
      isPending: DemandPending.notPending,
    };
    try {
      return await this.demandService.update(id, demand);
    } catch (e) {
      console.error('deleteFile error =>>', e);
      return {
        success: false,
        message: e,
      };
    }
  }

  @Post('/pass/:id')
  public async pass2(
    @Param('id') id: number,
    @Req() req: Request,
  ) {
    const demand: Demand = {
      creator: Number(req.headers.authId),
      isPending: DemandPending.notPending,
    };
    try {
      return await this.demandService.update(id, demand);
    } catch (e) {
      console.error('deleteFile error =>>', e);
      return {
        success: false,
        message: e,
      };
    }
  }

  @Put('/deleteFile')
  public async deleteFile(
    @Body() body: { demandId: number, fileId: number },
    @Req() req: Request,
  ) {
    try {
      return await this.demandService.deleteFile(body.demandId, body.fileId, Number(req.headers.authId));
    } catch (e) {
      console.error('deleteFile error =>>', e);
      return {
        success: false,
        message: e,
      };
    }
  }

  @Post('/deleteFile')
  public async deleteFile2(
    @Body() body: { demandId: number, fileId: number },
    @Req() req: Request,
  ) {
    try {
      return await this.demandService.deleteFile(body.demandId, body.fileId, Number(req.headers.authId));
    } catch (e) {
      console.error('deleteFile error =>>', e);
      return {
        success: false,
        message: e,
      };
    }
  }

  @Put(':id')
  public async update(
    @Param('id') id: number,
    @Req() req: Request,
    @Body() demand?: Demand,
  ): Promise<IResponse> {
    try {
      demand.creator = Number(req.headers.authId);
      return await this.demandService.update(id, demand);
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }

  @Post(':id')
  public async update2(
    @Param('id') id: number,
    @Req() req: Request,
    @Body() demand?: Demand,
  ): Promise<IResponse> {
    try {
      demand.creator = Number(req.headers.authId);
      return await this.demandService.update(id, demand);
    } catch (e) {
      return {
        success: false,
        message: e,
      };
    }
  }
}
