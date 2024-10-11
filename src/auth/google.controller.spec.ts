import { Test, TestingModule } from '@nestjs/testing';
import { AuthGoogleController } from './controllers/auth_google.controller';
import { AuthGoogleService } from './services/auth_google.service';
import { GoogleOauthGuard } from './guard/auth.google.guard';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('AuthGoogleController', () => {
  let app: INestApplication;
  let authService: AuthGoogleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthGoogleController],
      providers: [
        {
          provide: AuthGoogleService,
          useValue: {
            oAuthLogin: jest.fn().mockResolvedValue({
              id: 'testId',
              email: 'test@example.com',
              token: 'mockToken',
            }),
          },
        },
      ],
    })
      .overrideGuard(GoogleOauthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = {
            id: 'testId',
            email: 'test@example.com',
          };
          return true;
        },
      })
      .compile();

    app = module.createNestApplication();
    await app.init();

    authService = module.get<AuthGoogleService>(AuthGoogleService);
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /auth/google/callback', () => {
    it('should redirect to the correct URL with token', async () => {
      const response = await request(app.getHttpServer())
        .get('/auth/google/callback')
        .expect(302); // Expect redirect

      expect(response.headers.location).toBe('undefined/oauth?id=testId&email=test@example.com&token=mockToken');
      expect(authService.oAuthLogin).toHaveBeenCalledWith({
        id: 'testId',
        email: 'test@example.com',
      });
    });

    it('should handle errors', async () => {
      jest.spyOn(authService, 'oAuthLogin').mockRejectedValueOnce(new Error('Test Error'));

      const response = await request(app.getHttpServer())
        .get('/auth/google/callback')
        .expect(500);

      expect(response.body).toEqual({ success: false, message: 'Test Error' });
    });
  });
});
