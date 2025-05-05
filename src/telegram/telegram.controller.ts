import { Command, Ctx, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { Controller } from '@nestjs/common';

@Controller()
@Update()
export class TelegramController {
  @Start()
  async start(@Ctx() ctx: Context) {
    await ctx.reply('Добро пожаловать в магазин! Выберите опцию:', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: 'Каталог', callback_data: 'catalog' },
            { text: 'Контакты', callback_data: 'contacts' },
          ],
          [
            { text: 'Открыть меню', callback_data: 'open_menu' }, // Кнопка для открытия Web App
          ],
        ],
      },
    });
  }

  @Command('menu')
  async menu(@Ctx() ctx: Context) {
    await ctx.reply('Открываю меню...', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Каталог',
              web_app: { url: 'https://your-webapp-url.com' }, // Ваш веб-приложение
            },
          ],
        ],
      },
    });
  }

  // Обработчик для кнопки 'catalog'
  @Command('catalog')
  async catalog(@Ctx() ctx: Context) {
    await ctx.reply('Вы выбрали каталог!');
    // Здесь вы можете добавить логику для отображения каталога
  }

  // Обработчик для кнопки 'contacts'
  @Command('contacts')
  async contacts(@Ctx() ctx: Context) {
    await ctx.reply('Вы выбрали раздел контактов!');
    // Здесь вы можете добавить логику для отображения информации о контактах
  }

  // Обработчик для кнопки 'open_menu'
  @Command('open_menu')
  async openMenu(@Ctx() ctx: Context) {
    await ctx.reply('Открываю меню...', {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: 'Каталог',
              web_app: { url: 'https://your-webapp-url.com' },
            },
          ],
        ],
      },
    });
  }
}
