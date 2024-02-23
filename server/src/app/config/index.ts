import { config } from 'dotenv';
import { join } from 'path';
import os from 'os';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { EDbPrefix } from '@root/src/interfaces/enum';

const pjson = require(join(process.cwd(), 'package.json'));

config();
const validNodeEnv = ['development', 'test', 'staging', 'production'];

const appConfig = {
  cpuSize: os.cpus().length,
  app: {
    url: process.env.APP_URL as string,
    name: pjson.name,
    version: pjson.version,
    env: (validNodeEnv.includes((process.env as any).NODE_ENV) ? process.env.NODE_ENV : 'development') as string,
    port: parseInt((process.env as any).PORT) || 3000,
  },
  auth: {
    jwt: {
      secret: process.env.JWT_SECRET as string,
      expiration: process.env.JWT_EXPIRATION as string,
      issuer: process.env.JWT_ISSUER as string,
    },
  },
};

export const sendgridConfig = {
  secret: process.env.SENDGRID_SECRET as string,
};

export const dbConfig = (() => {
  const appEnv = appConfig.app.env;
  const dbPrefix = (EDbPrefix as any)[`${appEnv}`] ?? EDbPrefix.development;

  const host = process.env[`${dbPrefix}_DB_HOST`] as string;
  if (appEnv === 'test' && !['database', 'localhost'].includes(host)) throw new Error(`STRICT WARNING: DO NOT USE ${host} as HOST if NODE_ENV is test`);
  const socketPath = process.env.INSTANCE_CONNECTION_NAME;
  return {
    databases: {
      aha: {
        database: process.env[`${dbPrefix}_DB_NAME`] as string,
        username: process.env[`${dbPrefix}_DB_USER`] as string,
        password: process.env[`${dbPrefix}_DB_PASS`] as string,
      },
    },
    moduleOption: {
      type: 'mysql',
      port: parseInt((process.env as any)[`${dbPrefix}_DB_PORT`]) || 3306,
      synchronize: appEnv === 'test', // Syncronize only true if app env is test, don't use actual database while app env is test
      ...(socketPath && !['test', 'development'].includes(appEnv) ? { socketPath } : { host }),
      // autoLoadEntities: true
    } as TypeOrmModuleOptions,
  };
})();

export default appConfig;
