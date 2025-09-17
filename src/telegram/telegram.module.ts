import { Module }             from '@nestjs/common'
import { PrismaModule }       from '../prisma.module'
import { AuthModule }         from '../auth/auth.module'
import { OrdersModule }       from '../orders/orders.module'

import { TelegramService }    from './telegram.service'
import { TelegramController } from './telegram.controller'

@Module({
  imports: [
    PrismaModule,   // PrismaService
    AuthModule,     // AuthService
    OrdersModule,   // теперь с экспортом OrdersService
  ],
  providers: [
    TelegramService,
    TelegramController, // @Update()-контроллер ботa
  ],
})
export class TelegramModule {}