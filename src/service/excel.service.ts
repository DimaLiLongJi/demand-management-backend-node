import { Injectable } from '@nestjs/common';
import * as xlsx from 'node-xlsx';

@Injectable()
export class ExcelService {

  public buildExcel(title: string[] | number[], rows: Array<Array<string | number | Date>>): ArrayBuffer {
    const exctl = this.writeXls([
      title,
      ...rows,
    ]);
    return exctl;
  }

  private writeXls(datas: Array<Array<string | number | Date>>): ArrayBuffer {
    const buffer = xlsx.build([{
      name: 'sheet1',
      data: datas,
    }]);
    return buffer;
    // fs.writeFileSync('./the_content.xlsx', buffer, { 'flag': 'w' });//生成excel the_content是excel的名字，大家可以随意命名
  }
}
