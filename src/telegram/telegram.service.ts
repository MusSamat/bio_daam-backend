import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

@Injectable()
export class TelegramService {
  private readonly bot: Telegraf;
  private readonly logger = new Logger(TelegramService.name);

  constructor(private readonly configService: ConfigService) {
    // Initialize Telegram bot
    const botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!botToken) {
      this.logger.error('Telegram bot token is missing!');
      throw new Error('Telegram bot token is missing!');
    }

    this.bot = new Telegraf(botToken);
    this.setupBot();
    this.launchBot();
  }

  private setupBot() {
    // Start command handler
    this.bot.start((ctx) => {
      this.logger.log(`/start command from ${ctx.from?.username}`);
      return ctx.reply(
        'Welcome to the Delivery Bot! 🛍️\n\n' +
          'Use /menu to see available products\n' +
          'Use /help for assistance',
        this.getMenuButtons(),
      );
    });

    // Menu command handler
    this.bot.catch((err: unknown, ctx) => {
      if (err instanceof Error) {
        this.logger.error(
          `Bot error for ${ctx.updateType} update: ${err.message}`,
          err.stack,
        );
      } else {
        this.logger.error(
          `Bot error for ${ctx.updateType} update: Unknown error`,
          String(err),
        );
      }

      const userMessage = '❌ An error occurred. Please try again later.';

      if (ctx) {
        ctx.reply(userMessage).catch((e) => {
          this.logger.warn(
            'Failed to send error message to user',
            e instanceof Error ? e.message : String(e),
          );
        });
      } else {
        this.logger.warn('No context available to send error message');
      }

      return; // Explicitly return void
    });
  }

  private getMenuButtons(): ExtraReplyMessage {
    const webAppUrl = this.configService.get<string>('WEBAPP_URL');
    if (!webAppUrl) {
      this.logger.warn('WEBAPP_URL is not configured');
      throw new Error('Web app URL is not configured');
    }

    return {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🛒 Open Web App',
              web_app: { url: webAppUrl },
            },
          ],
          [
            { text: '📦 My Orders', callback_data: 'my_orders' },
            { text: 'ℹ️ Help', callback_data: 'help' },
          ],
        ],
      },
    };
  }

  private launchBot() {
    this.bot
      .launch()
      .then(() => this.logger.log('Telegram bot started successfully'))
      .catch((err) => this.logger.error('Failed to start bot:', err));

    process.once('SIGINT', () => this.bot.stop('SIGINT'));
    process.once('SIGTERM', () => this.bot.stop('SIGTERM'));
  }

  async sendMessage(chatId: string | number, message: string): Promise<void> {
    try {
      await this.bot.telegram.sendMessage(chatId, message);
      this.logger.log(`Message sent to ${chatId}`);
    } catch (err) {
      if (err instanceof Error) {
        this.logger.error(
          `Failed to send message to ${chatId}: ${err.message}`,
          err.stack,
        );
      } else {
        this.logger.error(`Failed to send message to ${chatId}: Unknown error`);
      }
      throw err;
    }
  }

  async notifyOrderUpdate(
    chatId: string | number,
    orderId: string,
    status: string,
  ): Promise<void> {
    const message =
      `🔄 Order Update\n\n` +
      `Order #${orderId}\n` +
      `Status: ${status}\n\n` +
      `Track your order in the web app.`;

    await this.sendMessage(chatId, message);
  }
}
