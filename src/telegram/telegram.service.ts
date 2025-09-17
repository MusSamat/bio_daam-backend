import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService }                            from '../prisma.service'
import { OrdersService }                            from '../orders/orders.service'
import { AuthService }                              from '../auth/auth.service'

type Lang = 'ru' | 'en' | 'kg'

@Injectable()
export class TelegramService {
  constructor(
      private readonly prisma: PrismaService,
      private readonly auth:    AuthService,
      private readonly orders:  OrdersService,
  ) {}

  async getMenu(lang: Lang = 'ru'): Promise<
      Array<{ id: number; name: string; price: number; imageUrl: string }>
  > {
    try {
      const items = await this.prisma.menuItem.findMany()
      return items.map(item => ({
        id:       item.id,
        name:
            lang === 'en'
                ? item.nameEn
                : lang === 'kg'
                    ? item.nameKg
                    : item.nameRu,
        price:    item.price,
        imageUrl: item.imageUrl ?? '',
      }))
    } catch (err) {
      throw new InternalServerErrorException('Не удалось получить меню')
    }
  }

  async createOrder(
      telegramId: string,
      items: { menuItemId: number; quantity: number }[],
  ) {
    // 1) upsert Telegram-юзера
    let user = await this.prisma.user.findUnique({ where: { telegramId } })
    if (!user) {
      user = await this.prisma.user.create({ data: { telegramId } })
    }

    // 2) создаём заказ через OrdersService
    //    — тут для бота не передаём payMethod/shippingInfo, используем дефолты
    const defaultShipping = {
      address1: '',
      address2: '',
      city:     '',
      postCode: '',
    }
    const defaultPay: 'Наличные' = 'Наличные'

    try {
      const orderDto = {
        user: {
          id: user.id,
          first_name: user.firstName!,
          last_name:  user.lastName ?? '',
          username:   '',          // у бота нет username
          language_code: '',
          allows_write_to_pm: false,
        },
        query_id:  '',             // не нужен при бот-заказе
        auth_date: Date.now().toString(),
        hash:      '',             // не нужен
        items,
        payMethod: defaultPay,
        shippingInfo: defaultShipping,
        comment:   null,
      }
      // минуя проверку HMAC, сразу костылим userId
      return await this.orders.createOrder(user.id, orderDto as any)
    } catch {
      throw new InternalServerErrorException('Ошибка создания заказа через бота')
    }
  }
}