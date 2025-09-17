import { Update, Start, Ctx, Hears, Action } from 'nestjs-telegraf';
import { Context, Markup } from 'telegraf';

@Update()
export class TelegramController {
  @Start()
  async onStart(@Ctx() ctx: Context) {
    const from = ctx.from
    const name =
        from?.username
            ? `@${from.username}`
            : [from?.first_name, from?.last_name].filter(Boolean).join(' ')
    await ctx.reply(
        `👋, ${name}!\n` +
        `Поехали за вкусным обедом! 🍽\n` +
        `Наз на кнопку для начала заказа.`,
        Markup.inlineKeyboard([
          [Markup.button.webApp('Открыть меню', process.env.WEBAPP_URL!)],
        ]),
    );
  }

  @Hears(/^привет$/i)
  async onHello(@Ctx() ctx: Context) {
    const from = ctx.from
    const name =
        from?.username
            ? `@${from.username}`
            : [from?.first_name, from?.last_name].filter(Boolean).join(' ')

    await ctx.reply(`Привет, ${name}! 👋`)
  }

  // Любые сообщения, которые _не_ ровно “привет”
  @Hears(/^(?!привет$).+/i)
  async onFallback(@Ctx() ctx: Context) {
    // ctx.message — это Union всех типов Message; проверим, что в нём есть текст
    const msg = ctx.message
    const text =
        msg && 'text' in msg && typeof msg.text === 'string'
            ? msg.text
            : ''

    await ctx.reply(
        `Вы написали: «${text}»\n\nНажмите кнопку ниже, чтобы открыть меню:`,
        Markup.inlineKeyboard([
          [ Markup.button.webApp('Открыть меню', process.env.WEBAPP_URL!) ],
        ]),
    )
  }
}