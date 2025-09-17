import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  I18nModule,
  I18nJsonLoader,
  AcceptLanguageResolver,
  QueryResolver,
  HeaderResolver,
} from 'nestjs-i18n';
import { join } from 'path';
import { TelegrafModule } from 'nestjs-telegraf';
import { PrismaModule } from './prisma.module';
import { TelegramModule } from './telegram/telegram.module';
import {MenuModule} from "./menu/menu.module";
import {AdminModule} from "./admin/admin.module";
import {AuthModule} from "./auth/auth.module";
import {OrdersModule} from "./orders/orders.module";
import {TelegramController} from "./telegram/telegram.controller";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env'}),

    I18nModule.forRoot({
      fallbackLanguage: 'ru',
      loader: I18nJsonLoader,
      loaderOptions: {
        path: join(__dirname, './i18n/'),
        watch: true,
      },
      resolvers: [{use: QueryResolver, options: ["lang", "locale"]} ],
    }),

    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_BOT_TOKEN!,
      launchOptions: {
        // webhook: {
        //   domain: process.env.WEBHOOK_URL!,
        //   hookPath: `/telegraf/${process.env.TELEGRAM_BOT_TOKEN!}`,
        // },
      },
      include: [TelegramModule],
    }),
    PrismaModule,
    AuthModule,
    TelegramModule,
    MenuModule,
    OrdersModule,
    AdminModule
  ],
})
export class AppModule {}