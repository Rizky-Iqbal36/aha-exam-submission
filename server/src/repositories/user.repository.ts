import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import UserModel from '@db/models/user.model';
import UserSession from '@db/models/userSession.model';

@Injectable()
export default class UserRepository extends Repository<UserModel> {
  constructor(dataSource: DataSource) {
    super(UserModel, dataSource.createEntityManager());
  }

  public async userWithLastSession() {
    return this.createQueryBuilder('u')
      .select(['u.*', 'MAX(us.recordCreated) AS lastSessionDate'])
      .leftJoin(UserSession, 'us', 'us.userId = u.id')
      .groupBy('u.id')
      .getRawMany<UserModel & { lastSessionDate: string | null }>();
  }
}
