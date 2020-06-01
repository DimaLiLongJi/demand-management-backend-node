import { Injectable } from '@nestjs/common';
import * as DEV_CONFIG from '../../config/dev.config.json';
import * as PROD_CONFIG from '../../config/prod.config.json';

export type ConfigType = typeof DEV_CONFIG;
export type EnvType = 'dev' | 'prod';

@Injectable()
export class EnvService {

  private getEnv(): EnvType {
    return process.env.NODE_ENV as EnvType;
  }

  public getConfig(): ConfigType {
    const env = this.getEnv();
    if (env === 'dev') return DEV_CONFIG;
    if (env === 'prod') return PROD_CONFIG;
    return DEV_CONFIG;
  }
}
