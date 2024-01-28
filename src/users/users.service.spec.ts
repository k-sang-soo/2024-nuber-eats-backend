import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Verification } from './entities/verification.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';

const mockRespository = {
  findOne: jest.fn(),
  save: jest.fn(),
  ceate: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockMailService = {
  sendVerificationEmail: jest.fn(),
};

const mockConfigService = {};

// user service 유닛 테스트
describe('UserService', () => {
  let service: UsersService;
  // beforeAll 모든 테스트가 실행되기 전에 딱 한 번 함수를 실행
  beforeAll(async () => {
    // 테스트만 할 수 있는 독립된 테스팅 모듈 생성
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          // 여기서 불러오는 건 TypeORM에서 불러오는 것이 아닌 Mock Repository을 제공
          // getRepositoryToken 은 entity의 Repository token을 제공
          provide: getRepositoryToken(User),
          useValue: mockRespository,
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRespository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: MailService,
          useValue: mockMailService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it.todo('createAccount');
  it.todo('login');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
