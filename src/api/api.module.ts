import { Module, MiddlewareConsumer } from '@nestjs/common';

import { LoggerMiddleware } from '../middleware/logger.middleware';
import { AuthMiddleware } from '../middleware/auth.middleware';

import { UserController } from './user.controller';
import { AuthController } from './auth.controller';
import { PermissionController } from './permission.controller';
import { ModuleController } from './module.controller';
import { RoleController } from './role.controller';
import { DemandTypeController } from './demand-type.controller';
import { DemandStatusController } from './demand-status.controller';
import { DemandController } from './demand.controller';
import { DemandProgressController } from './demand-progress.controller';
import { DemandLogontroller } from './demand-log.controller';
import { DemandNodeController } from './demand-node.controller';
import { ApproverController } from './approver.controller';

@Module({
  controllers: [
    UserController,
    AuthController,
    PermissionController,
    ModuleController,
    RoleController,
    DemandTypeController,
    DemandStatusController,
    DemandController,
    DemandProgressController,
    DemandLogontroller,
    DemandNodeController,
    ApproverController,
  ],
})
export class ApiModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, AuthMiddleware)
      .forRoutes('/api');
  }
}
