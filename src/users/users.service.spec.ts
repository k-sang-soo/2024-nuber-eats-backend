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
  findOneOrFail: jest.fn(),
  delete: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(() => 'signed-token-baby'),
  verify: jest.fn(),
});

const mockMailService = () => ({
  sendVerificationEmail: jest.fn(),
});

const mockConfigService = () => ({});

// mockRepository 다른 점은 mockRepository은 UsersService 사용하는 함수
// MockRepository 은 함수의 반환 값을 속이기 위함
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

// user service 유닛 테스트
describe('UserService', () => {
  let service: UsersService;
  let usersRepository: MockRepository<User>;
  let verificationRepository: MockRepository<Verification>;
  let jwtService: JwtService;
  let mailService: MailService;

  // beforeAll 모든 테스트가 실행되기 전에 딱 한 번 함수를 실행
  // beforeAll 은 모든 테스트에 적용되는 전역적인 설정에 사용
  // beforeEach 는 각 테스트 함수 마다 독립적인 설정 또는 상태를 설정할 때 사용
  // beforeEach 는 테스트 함수마다 독립적인 초기화 작업에 사용

  beforeEach(async () => {
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
          useValue: mockJwtService(),
        },
        {
          provide: MailService,
          useValue: mockMailService(),
        },
        {
          provide: ConfigService,
          useValue: mockConfigService(),
        },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    mailService = module.get<MailService>(MailService);
    usersRepository = module.get(getRepositoryToken(User));
    verificationRepository = module.get(getRepositoryToken(Verification));
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
      usersRepository.save.mockResolvedValue(createAccountArgs);
      verificationRepository.create.mockReturnValue({
        user: createAccountArgs,
      });
      // sendVerificationEmail 을 실행시켜주기 위해 save를 호출 할 때 code를 return 함
      verificationRepository.save.mockReturnValue({
        code: 'code',
      });

      // UsersService 의 createAccount 를 호출
      const result = await service.createAccount(createAccountArgs);
      // 이 함수가 단 한번 호출되어야한다는 것을 의미
      expect(usersRepository.create).toHaveBeenCalledTimes(1);
      // 이 함수가 실행될 때 toHaveBeenCalledWith의 파라미터 값이 꼭 존재해야된다.
      expect(usersRepository.create).toHaveBeenCalledWith(createAccountArgs);
      expect(usersRepository.save).toHaveBeenCalledTimes(1);
      expect(usersRepository.save).toHaveBeenCalledWith(createAccountArgs);
      expect(verificationRepository.create).toHaveBeenCalledTimes(1);
      expect(verificationRepository.create).toHaveBeenCalledWith({
        user: createAccountArgs,
      });
      expect(verificationRepository.save).toHaveBeenCalledTimes(1);
      expect(verificationRepository.save).toHaveBeenCalledWith({
        user: createAccountArgs,
      });
      expect(mailService.sendVerificationEmail).toBeCalledTimes(1);

      // 함수가 파라미터의 어떤 타입을 사용했는지 확인해줌
      expect(mailService.sendVerificationEmail).toBeCalledWith(
        expect.any(String),
        expect.any(String),
      );
      expect(result).toEqual({ ok: true });
    });

    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.createAccount(createAccountArgs);
      expect(result).toEqual({ ok: false, error: 'Couldn`t create account' });
    });
  });

  describe('login', () => {
    const loginArgs = {
      email: 'bs@email.com',
      password: 'bs.password',
    };
    it('should fail of user does not exist', async () => {
      // service.login 안에 findOne의 값을 가로채서 usersRepository.findOne.mockResolvedValue 의 값으로 변경
      // await service.login 에 굳이 null 을 안주고 mockResolvedValue 을 사용하는 이유는
      // findOne 하나의 함수의 동작을 격리시켜 테스트하기 위해서
      usersRepository.findOne.mockResolvedValue(null);
      const result = await service.login(loginArgs);

      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith(expect.any(Object));

      expect(result).toEqual({
        ok: false,
        error: 'User not found',
      });
    });

    it('should fail if the password is wrong', async () => {
      const mockedUser = {
        checkPassword: jest.fn(() => Promise.resolve(false)),
      };
      usersRepository.findOne.mockResolvedValue(mockedUser);
      const result = await service.login(loginArgs);
      expect(result).toEqual({ ok: false, error: 'Wrong password' });
    });

    it('should return token if password correct', async () => {
      const mockedUser = {
        id: 1,
        checkPassword: jest.fn(() => Promise.resolve(true)),
      };
      usersRepository.findOne.mockResolvedValue(mockedUser);
      const result = await service.login(loginArgs);
      expect(jwtService.sign).toHaveBeenCalledTimes(1);
      expect(jwtService.sign).toBeCalledWith(expect.any(Number));
      expect(result).toEqual({ ok: true, token: 'signed-token-baby' });
    });

    it('should fail on exception', async () => {
      usersRepository.findOne.mockRejectedValue(new Error());
      const result = await service.login(loginArgs);
      expect(result).toEqual({ ok: false, error: 'Can`t log user in' });
    });
  });

  describe('findById', () => {
    const findByIdArgs = {
      id: 1,
    };
    it('should find an existing user', async () => {
      usersRepository.findOneOrFail.mockResolvedValue(findByIdArgs);
      const result = await service.findById(1);
      expect(result).toEqual({ ok: true, user: findByIdArgs });
    });

    it('should fail if no user if found', async () => {
      usersRepository.findOneOrFail.mockRejectedValue(new Error());
      const result = await service.findById(1);
      expect(result).toEqual({ ok: false, error: 'User Not Found' });
    });
  });

  describe('editProfile', () => {
    it('should change email', async () => {
      const oldUser = {
        id: 1,
        email: 'bs@old.com',
        verified: true,
      };
      const editProfileArgs = {
        userId: 1,
        input: { email: 'bs@new.com' },
      };
      const newVerification = {
        code: 'code',
      };

      const newUser = {
        id: 1,
        email: editProfileArgs.input.email,
        verified: false,
      };

      usersRepository.findOne.mockResolvedValue(oldUser);
      verificationRepository.delete.mockResolvedValue({ affected: 1 });
      verificationRepository.create.mockReturnValue(newVerification);
      verificationRepository.save.mockResolvedValue(newVerification);

      await service.editProfile(editProfileArgs.userId, editProfileArgs.input);
      expect(usersRepository.findOne).toHaveBeenCalledTimes(1);
      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { id: editProfileArgs.userId },
      });

      expect(verificationRepository.delete).toHaveBeenCalledWith({
        user: { id: editProfileArgs.userId },
      });

      expect(verificationRepository.create).toHaveBeenCalledWith({
        user: newUser,
      });
      expect(verificationRepository.save).toHaveBeenCalledWith(newVerification);

      expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
        newUser.email,
        newVerification.code,
      );
    });

    // it('should change password', async () => {
    //   const editProfileArgs = {
    //     userId: 1,
    //     input: { email: 'bs@new.com' },
    //   };
    //   usersRepository.findOne.mockResolvedValue({ password: 'old' });
    //   await service.editProfile(editProfileArgs.userId, editProfileArgs.input);
    //   expect(usersRepository.save).toHaveBeenCalledTimes(1);
    //   expect(usersRepository.save).toHaveBeenCalledWith(editProfileArgs.input);
    // });
  });
  it.todo('verifyEmail');
});
