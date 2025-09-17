// src/orders/orders.controller.ts
import {
    Controller,
    Post,
    Body,
    BadRequestException,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { OrdersService }  from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
    constructor(
        private readonly ordersService: OrdersService,
    ) {}

    @Post()
    @ApiOperation({ summary: 'Создать заказ (на основании авторизованного userId)' })
    @ApiResponse({ status: 201, description: 'Заказ успешно создан' })
    @ApiResponse({ status: 400, description: 'Неправильный формат запроса' })
    async create(@Body() dto: CreateOrderDto) {
        // Проверим, что userId существует в БД (опционально)
        // Если нет такого юзера — бросим ошибку:
        const userExists = await this.ordersService.prisma.user.findUnique({
            where: { id: dto.userId }
        })
        if (!userExists) {
            throw new BadRequestException('Пользователь не найден')
        }

        // Создаём заказ
        const order = await this.ordersService.createOrder(dto.userId, dto)
        return { orderId: order.id }
    }
}