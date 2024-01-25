import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile';
import { Verification } from './entities/verification.entity';
import { UserProfileOutPut } from './dtos/user-profile.dto';
import { VerifyEmailOutput } from './entities/verify-email.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verification: Repository<Verification>,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    // check new user
    try {
      // findOne 주어진 condition(환경)과 일치하는 첫 번째 entity를 찾는다.
      const exists = await this.users.findOne({ where: { email } });
      if (exists) {
        // make error
        return {
          ok: false,
          error: 'There is a user with that email already',
        };
      }
      // 오류가 없다면 아무것도 return 하지 않음
      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );
      const verification = await this.verification.save(
        this.verification.create({
          user,
        }),
      );
      this.mailService.sendVerificationEmail(user.email, verification.code);
      return {
        ok: true,
      };
    } catch (e) {
      return {
        ok: false,
        error: 'Couldn`t create account',
      };
    }
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    try {
      // find the user with the email
      // check if the apssword is correct
      // make a JWT and give it to the user
      const user = await this.users.findOne({
        where: { email },
        select: ['id', 'password'],
      });
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong password',
        };
      }
      const token = this.jwtService.sign(user.id);
      return {
        ok: true,
        token,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  async findById(id: number): Promise<UserProfileOutPut> {
    try {
      const user = await this.users.findOne({ where: { id } });
      if (user) {
        return {
          ok: true,
          user,
        };
      }
    } catch (error) {
      return {
        ok: false,
        error: 'User Not Found',
      };
    }
  }

  async editProfile(
    userId: number,
    { email, password }: EditProfileInput,
  ): Promise<EditProfileOutput> {
    // update 는 빠르고 효율적인 동작을 위해 data가 존재 유/무를 따지지 않고 무조건 업데이트 시켜줌
    // 원래라면 유효성 검사를 해야겠지만 userId가 없으면 login을 할 수 없기 때문에 검증 없이 사용
    // userId는 graphQL이 아니고 token 의 데이터이기 때문에 검증 됐다고 판단

    // args 를 받을 떄 { email, password } 이런식으로 사용하게 된다면
    // password를 보내지 않았을 때 undefined 값을 받게 된다.
    // return this.users.update(userId, { email, password });

    // updeate에서 save로 변경한 이유는 password를 hash화 시커야되는데
    // update는 entity가 있는 지 확인하지 않고 바로 db에서 데이터를 변경하기 때문에
    // entity에서 BeforeUpdate 가 작동되지 않는다.
    // save를 사용하면 기존에 없는 건 생성하고 기존에 존재하는 경우에는 update를 한다.
    try {
      const user = await this.users.findOne({
        where: {
          id: userId,
        },
      });

      if (email) {
        user.email = email;
        user.verified = false;
        console.log('user', user);
        const verification = await this.verification.save(
          this.verification.create({ user }),
        );

        console.log('verification', verification);
        this.mailService.sendVerificationEmail(user.email, verification.code);
      }

      if (password) {
        user.password = password;
      }

      await this.users.save(user);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not update profile.',
      };
    }
  }

  async verifyEmail(code: string): Promise<VerifyEmailOutput> {
    try {
      const verification = await this.verification.findOne({
        where: { code },
        // relations 설정이 되어있어야 entity의 관계 ID를 로드하고
        // 해당 필드의 전체 데이터를 가져올 수 있다.
        relations: ['user'],
      });
      if (verification) {
        verification.user.verified = true;
        await this.users.save(verification.user);
        await this.verification.delete(verification.id);
        return {
          ok: true,
        };
      }
      return {
        ok: false,
        error: 'Verification not found.',
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
