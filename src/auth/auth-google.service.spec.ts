import { Test, TestingModule } from '@nestjs/testing';
import { AuthGoogleService } from './services/auth_google.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Role } from '../users/entities/roles.enum';

describe('AuthGoogleService', () => {
  let service: AuthGoogleService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let userRepository: Repository<User>;

  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'hashed_password',
    role: Role.USER,
    picture: 'url_to_picture',
  };

  const newUser = new CreateUserDto();
  newUser.name = mockUser.name;
  newUser.email = mockUser.email;
  newUser.photo_url = mockUser.picture;
  newUser.password = 'google_password';
  newUser.role = Role.USER;

  const mockUserRepository = {
    findOne: jest.fn().mockImplementation((criteria) => {
      if (criteria.where.email === mockUser.email) {
        return Promise.resolve(mockUser);
      }
      return Promise.resolve(null);
    }),
    save: jest.fn().mockImplementation((user) => Promise.resolve({ id: '1', ...user })),
  };

  const mockUsersService = {
    create: jest.fn().mockImplementation((dto) => Promise.resolve({ id: '2', ...dto })),
  };

  const mockJwtService = {
    sign: jest.fn().mockImplementation((payload) => 'mock_token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthGoogleService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<AuthGoogleService>(AuthGoogleService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('oAuthLogin', () => {
    it('should log in an existing user', async () => {
      const user = {
        email: 'john.doe@example.com',
        name: 'John Doe',
        picture: 'url_to_picture',
      };

      const result = await service.oAuthLogin(user);

      expect(result).toEqual({
        id: '1',
        email: mockUser.email,
        name: mockUser.name,
        role: "USER",
        token: 'mock_token',
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: user.email },
        select: { id: true, email: true, password: true },
      });
    });

    it('should register and log in a new user', async () => {
      const newUser = {
        email: 'new.user@example.com',
        name: 'New User',
        picture: 'url_to_picture',
      };

      mockUserRepository.findOne = jest.fn().mockResolvedValueOnce(null);

      const result = await service.oAuthLogin(newUser);

      expect(result).toEqual({
        id: undefined,
        email: newUser.email,
        name: newUser.name,
        role: undefined,
        token: 'mock_token',
      });
      expect(usersService.create).toHaveBeenCalledWith({
        name: newUser.name,
        email: newUser.email,
        photo_url: newUser.picture,
        password: process.env.GOOGlE_PASSWORD,
        role: Role.USER,
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: newUser.email },
        select: { id: true, email: true, password: true },
      });
    });

    it('should throw an error if user is not provided', async () => {
      await expect(service.oAuthLogin(null)).rejects.toThrow('User not found!!!');
    });
  });
});
