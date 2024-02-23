import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { dbConfig } from '@app/config';
const { databases, moduleOption } = dbConfig;

import UserModel from '@db/models/user.model';
const ahaTables = [UserModel];

const ahaDBConfig = { ...moduleOption, ...databases.aha, entities: ahaTables } as TypeOrmModuleOptions;
export const databaseAha = TypeOrmModule.forRootAsync({ useFactory: () => ahaDBConfig });
