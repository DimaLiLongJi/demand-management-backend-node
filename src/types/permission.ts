export class Permission {
  public id?: number;
  public name: string;
  /**
   * 权限类型 1 或 2
   * 1：访问权限，控制路由route
   * 2：操作权限控制，控制操作项operating
   */
  public type: '1' | '2';
  public route?: string;
  public operating?: string;
  public module: number;
  public creator: number;
  public createDate?: Date;
  public updateDate?: Date;
  public deleteDate?: Date;
}
