import { config } from 'dotenv';
import { join } from 'path';
import os from 'os';

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

export default appConfig;
