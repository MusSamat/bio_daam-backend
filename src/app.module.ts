import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TelegrafModule } from 'nestjs-telegraf';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/user.entity';
import { Product } from './products/product.entity';
import { Order } from './orders/order.entity';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { TelegramModule } from './telegram/telegram.module';
import { AuthModule } from './auth/auth.module';
import * as Joi from 'joi';

@Module({
  imports: [
    // Configuration Module (must be first)
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(5432),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        TELEGRAM_BOT_TOKEN: Joi.string().required(),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
      }),
    }),

    // Database Module (async configuration)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [User, Product, Order],
        synchronize: config.get<string>('NODE_ENV') !== 'production',
        logging: config.get<string>('NODE_ENV') === 'development',
        extra: {
          ssl:
            config.get<string>('NODE_ENV') === 'production'
              ? { rejectUnauthorized: false }
              : false,
        },
      }),
      inject: [ConfigService],
    }),

    // Telegram Module (async configuration)
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const token = config.get<string>('TELEGRAM_BOT_TOKEN');
        if (!token) {
          throw new Error('TELEGRAM_BOT_TOKEN must be defined');
        }

        const webhookDomain = config.get<string>('WEBHOOK_DOMAIN');

        // For production (webhook)
        if (webhookDomain) {
          return {
            token,
            launchOptions: {
              webhook: {
                domain: webhookDomain,
                hookPath: '/telegram-webhook',
              },
            },
          };
        }

        // For development (polling)
        return {
          token,
          launchOptions: undefined, // Will use polling
        };
      },
      inject: [ConfigService],
    }),

    // Feature Modules
    UsersModule,
    ProductsModule,
    OrdersModule,
    TelegramModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
