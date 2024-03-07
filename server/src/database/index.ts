import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { dbConfig } from '@app/config';
const { databases, moduleOption } = dbConfig;

import UserModel from '@db/models/user.model';
import UserSessionModel from '@db/models/userSession.model';
const ahaTables = [UserModel, UserSessionModel];

const ahaDBConfig = { ...moduleOption, ...databases.aha, entities: ahaTables } as TypeOrmModuleOptions;
export const databaseAha = TypeOrmModule.forRootAsync({ useFactory: () => ahaDBConfig });
