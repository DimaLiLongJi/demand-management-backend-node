import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult, FindOperator } from 'typeorm';
import { FileEntity } from './file.entity';
import { File } from '../../types';

@Injectable()
export class FileDAO {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileEntity: Repository<FileEntity>,
  ) {}

  public async save(demandStatus: File): Promise<FileEntity> {
    return this.fileEntity.save(demandStatus as any);
  }

  public async findAll(): Promise<FileEntity[]> {
    return this.fileEntity.find({
      relations: ['creator'],
      order: {
        id: 'ASC',
      },
    });
  }

  public async findOne(where: any): Promise<FileEntity> {
    return this.fileEntity.findOne({
      where,
      relations: ['creator'],
    });
  }

  public async findById(id: number): Promise<FileEntity> {
    return this.fileEntity.findOne(id, {relations: ['creator']});
  }

  public async findByIds(ids?: number[]): Promise<FileEntity[]> {
    return this.fileEntity.findByIds(ids, {
      relations: ['creator'],
      order: {
        id: 'ASC',
      },
    });
  }
}
