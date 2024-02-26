import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import UserModel from '@db/models/user.model';

@Injectable()
export default class UserRepository extends Repository<UserModel> {
  constructor(dataSource: DataSource) {
    super(UserModel, dataSource.createEntityManager());
  }
}
