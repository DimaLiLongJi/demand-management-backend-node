import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from './user/user.entity';
import { PermissionEntity } from './permission/permission.entity';
import { ModuleEntity } from './module/module.entity';
import { RoleEntity } from './role/role.entity';
import { DemandTypeEntity } from './demand-type/demand-type.entity';
import { DemandStatusEntity } from './demand-status/demand-status.entity';
import { DemandEntity } from './demand/demand.entity';
import { DemandProgressEntity } from './demand-progress/demand-progress.entity';
import { DemandLogEntity } from './demand-log/demand-log.entity';
import { FileEntity } from './file/file.entity';
import { DemandNodeEntity } from './demand-node/demand-node.entity';
import { ApproverEntity } from './approver/approver.entity';

import { UserDAO } from './user/user.dao';
import { ModuleDAO } from './module/module.dao';
import { PermissionDAO } from './permission/permission.dao';
import { RoleDAO } from './role/role.dao';
import { DemandTypeDAO } from './demand-type/demand-type.dao';
import { DemandStatusDAO } from './demand-status/demand-status.dao';
import { DemandDAO } from './demand/demand.dao';
import { DemandProgressDAO } from './demand-progress/demand-progress.dao';
import { DemandLogDAO } from './demand-log/demand-log.dao';
import { FileDAO } from './file/file.dao';
import { DemandNodeDAO } from './demand-node/demand-node.dao';
import { ApproverDAO } from './approver/approver.dao';

import { EnvService } from '../service/env.service';

const envService = new EnvService();
const config = envService.getConfig();

const DOAList = [
  UserDAO,
  PermissionDAO,
  ModuleDAO,
  RoleDAO,
  DemandTypeDAO,
  DemandStatusDAO,
  DemandDAO,
  DemandProgressDAO,
  DemandLogDAO,
  FileDAO,
  DemandNodeDAO,
  ApproverDAO,
];

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: config.database.host,
      port: config.database.port,
      username: config.database.username,
      password: config.database.password,
      database: config.database.database,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: 'all',
    }),
    TypeOrmModule.forFeature([
      UserEntity,
      PermissionEntity,
      ModuleEntity,
      RoleEntity,
      DemandTypeEntity,
      DemandStatusEntity,
      DemandEntity,
      DemandProgressEntity,
      DemandLogEntity,
      FileEntity,
      DemandNodeEntity,
      ApproverEntity,
    ]),
  ],
  providers: [
    ...DOAList,
  ],
  exports: [
    ...DOAList,
  ],
})
export class DAOModule { }
