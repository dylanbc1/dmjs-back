import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn((email, password) => {
              return { email, token: 'mockToken' };
            }),
          },
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return a token for valid credentials', async () => {
      const signInDto = { email: 'test@example.com', password: 'password' };
      const result = await authController.create(signInDto);

      expect(result).toEqual({ email: 'test@example.com', token: 'mockToken' });
      expect(authService.signIn).toHaveBeenCalledWith('test@example.com', 'password');
    });

    it('should call the signIn method of the AuthService', async () => {
      const signInDto = { email: 'test@example.com', password: 'password' };
      await authController.create(signInDto);

      expect(authService.signIn).toHaveBeenCalled();
      expect(authService.signIn).toHaveBeenCalledWith(signInDto.email, signInDto.password);
    });
  });
});
