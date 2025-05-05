import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegramService } from './telegram.service';
import { TelegramController } from './telegram.controller';

@Module({
  imports: [
    ConfigModule,
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const token = config.get<string>('TELEGRAM_BOT_TOKEN');

        if (!token) {
          throw new Error('TELEGRAM_BOT_TOKEN не задан!');
        }

        return {
          token,
          launchOptions: undefined,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [TelegramService],
  controllers: [TelegramController],
})
export class TelegramModule {}
