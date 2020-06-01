import { Module, Global } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { EnvService } from './env.service';
import { PermissionService } from './permission.service';
import { ModuleService } from './module.service';
import { RoleService } from './role.service';
import { DemandTypeService } from './demand-type.service';
import { DemandStatusService } from './demand-status.service';
import { DemandService } from './demand.service';
import { DemandProgressService } from './demand-progress.service';
import { DemandLogService } from './demand-log.service';
import { ExcelService } from './excel.service';
import { EmailService } from './email.service';
import { FileService } from './file.service';
import { DemandNodeService } from './demand-node.service';
import { ApproverService } from './approver.service';

const serviceList = [
  EnvService,
  AuthService,
  UserService,
  PermissionService,
  ModuleService,
  RoleService,
  DemandTypeService,
  DemandStatusService,
  DemandService,
  DemandProgressService,
  DemandLogService,
  ExcelService,
  EmailService,
  FileService,
  DemandNodeService,
  ApproverService,
];

const envService = new EnvService();
const config = envService.getConfig();

@Global()
@Module({
  imports: [
    JwtModule.register({
      secret: config.jwtSecret,
      signOptions: {
        expiresIn: '7 days',
      },
    }),
  ],
  providers: [
    ...serviceList,
  ],
  exports: [
    JwtModule,
    ...serviceList,
  ],
})
export class ServiceModule { }
