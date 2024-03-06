import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import UserSession from '@db/models/userSession.model';

@Injectable()
export default class UserSessionRepository extends Repository<UserSession> {
  constructor(dataSource: DataSource) {
    super(UserSession, dataSource.createEntityManager());
  }

  public async userActiveSessionOnLastNDay(interval: number) {
    return this.createQueryBuilder()
      .select(['COUNT(DISTINCT userId) AS activeUser', 'recordCreated'])
      .where(`DATE(DATE_SUB(NOW(), INTERVAL ${(interval < 1 ? 1 : interval) - 1} DAY)) <= recordCreated`) // interval substract 1 to include today
      .groupBy('recordCreated')
      .orderBy('recordCreated', 'DESC')
      .getRawMany<{ activeUser: number; recordCreated: string }>();
  }
}
