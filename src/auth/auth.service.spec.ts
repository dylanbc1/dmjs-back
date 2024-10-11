import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './services/auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'hashed_password',
    role: 'user',
  };

  const mockUsersService = {
    findByEmail: jest.fn().mockImplementation((email) => {
      if (email === 'john.doe@example.com') {
        return Promise.resolve(mockUser);
      }
      return Promise.resolve(null);
    }),
  };

  const mockJwtService = {
    signAsync: jest.fn().mockImplementation((payload) => Promise.resolve('mock_token')),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: {}
        }
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a JWT token and user info for valid credentials', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.signIn('john.doe@example.com', 'password');
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
        token: 'mock_token',
      });

      expect(usersService.findByEmail).toHaveBeenCalledWith('john.doe@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('password', mockUser.password);
      expect(jwtService.signAsync).toHaveBeenCalledWith({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        role: mockUser.role,
      });
    });

    it('should throw an UnauthorizedException for invalid email', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.signIn('invalid.email@example.com', 'password')).rejects.toThrow(
        new UnauthorizedException('Invalid email or password.'),
      );

      expect(usersService.findByEmail).toHaveBeenCalledWith('invalid.email@example.com');
    });

    it('should throw an UnauthorizedException for invalid password', async () => {
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.signIn('john.doe@example.com', 'invalid_password')).rejects.toThrow(
        new UnauthorizedException('Invalid email or password.'),
      );

      expect(usersService.findByEmail).toHaveBeenCalledWith('john.doe@example.com');
      expect(bcrypt.compare).toHaveBeenCalledWith('invalid_password', mockUser.password);
    });
  });
});
