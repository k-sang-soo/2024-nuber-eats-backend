import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAccountInput } from './dtos/create-account.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async createAccout({ email, password, role }: CreateAccountInput) {
    // check new user
    try {
      // findOne 주어진 condition(환경)과 일치하는 첫 번째 entity를 찾는다.
      const exists = await this.users.findOne({ where: { email } });
      if (exists) {
        // make error
        return;
      }

      await this.users.save(this.users.create({ email, password, role }));
    } catch (e) {
      return;
    }
  }
}
