import { Test } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/users.entity';
import { Verification } from './entities/verification.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';

const mockRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

const mockJwtService = {
  sign: jest.fn(),
  verify: jest.fn(),
};

const mockMailService = {
  sendVerificationEmail: jest.fn(),
};

const mockConfigService = {};

// mockRepository 다른 점은 mockRepository은 UsersService 사용하는 함수
// MockRepository 은 함수의 반환 값을 속이기 위함
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

// user service 유닛 테스트
describe('UserService', () => {
  let service: UsersService;
  let usersRepository: MockRepository<User>;

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
          useValue: mockRepository(),
        },
        {
          provide: getRepositoryToken(Verification),
          useValue: mockRepository(),
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
    usersRepository = module.get(getRepositoryToken(User));
  });

  it('should be defined', () => {
    // service 라는 변수가 정의 되어있는 지 확인
    expect(service).toBeDefined();
  });

  describe('createAccount', () => {
    const createAccountArgs = {
      email: '',
      password: '',
      role: 0,
    };

    it('should fail if user exists', async () => {
      usersRepository.findOne.mockResolvedValue({
        id: 1,
        email: 'allalalaa',
      });
      const result = await service.createAccount(createAccountArgs);

      // result 객체를 비교하여 result return 값과 toMatchObject의 값이 일치하는 지 확인
      // 일치하지 않는다면 테스트 실패
      expect(result).toMatchObject({
        ok: false,
        error: 'There is a user with that email already',
      });
    });

    it('should create a new user', async () => {
      // user가 없는 것 처럼 보이게 하기 위해서 사용
      // mockResolvedValue 은 await 를 사용하는 줄은 하나의 promise를 반환하기 때문에 사용
      // 그게 아닌 경우에는 mockReturnValue 를 사용
      usersRepository.findOne.mockResolvedValue(undefined);

      // TypeORM 레포지토리의 create 메소드를 mock
      usersRepository.create.mockReturnValue(createAccountArgs);

      // UsersService 의 createAccount 를 호출
      await service.createAccount(createAccountArgs);
      // 이 함수가 단 한번 호출되어야한다는 것을 의미
      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      // 이 함수가 실행될 때 toHaveBeenCalledWith의 파라미터 값이 꼭 존재해야된다.
      expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs);
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);
    });
  });

  it.todo('login');
  it.todo('findById');
  it.todo('editProfile');
  it.todo('verifyEmail');
});
