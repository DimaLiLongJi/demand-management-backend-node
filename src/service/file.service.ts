import { Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { File } from '../types';
import { FileDAO } from '../dao/file/file.dao';
import { FileEntity } from '../dao/file/file.entity';
import { join } from 'path';

@Injectable()
export class FileService {
  constructor(
    private fileDAO: FileDAO,
  ) { }

  public create(file: File): Promise<FileEntity> {
    return this.fileDAO.save(file);
  }

  public findById(id: number): Promise<FileEntity> {
    return this.fileDAO.findById(id);
  }

  public findByIds(ids: number[]): Promise<FileEntity[]> {
    return this.fileDAO.findByIds(ids);
  }

  public writeFile(
    file: {
      fieldname: string,
      originalname: string,
      encoding: string,
      mimetype: string,
      buffer: Buffer,
      size: number,
    },
  ): string {
    const fileName = `${file.originalname}-${Date.now()}`;
    const writeStream = createWriteStream(join(__dirname, '../..', 'static', fileName));
    try {
      writeStream.write(file.buffer, () => {
        console.log(`${fileName} 文件传输完毕`);
        writeStream.end();
      });
      return fileName;
    } catch (e) {
      throw new Error(`存储文件报错：${e}`);
    }
  }
}
