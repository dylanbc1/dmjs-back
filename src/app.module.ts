import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { ResourcesModule } from './resources/resources.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { AuthGuard } from './auth/guard/auth.guard';
import { AddressModule } from './address/address.module';
import { Repository } from 'typeorm';
import { ProductsModule } from './products/products.module';
import { ReportsModule } from './reports/reports.module';
import { SeedModule } from './seed/seed.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { google } from 'googleapis'
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
        secure: false,
        port:587
      },

      defaults: {
        from: '"DMaJor Store" <no-reply@dmajorstore.com>',
      }
    }),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities:true,
      synchronize: false,
      ssl: {
        rejectUnauthorized :false
      },
      //logger: 'advanced-console',
      //logging: 'all'
    }),
    AuthModule,
    ResourcesModule,
    OrdersModule,
    UsersModule,
    AddressModule,
    Repository,
    ProductsModule,
    TypeOrmModule,
    ReportsModule,
    SeedModule
  ],
  controllers: [AppController],
  providers: [AppService, AuthGuard],
})
export class AppModule {}
