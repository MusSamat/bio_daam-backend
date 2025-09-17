import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma.module'
import { OrdersService } from './orders.service'
import { OrdersController } from './orders.controller'
import {AuthModule} from "../auth/auth.module";

@Module({
    imports:    [PrismaModule, AuthModule],
    providers:  [OrdersService],
    controllers:[OrdersController],
    exports:    [OrdersService],
})
export class OrdersModule {}