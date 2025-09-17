// src/orders/orders.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService }                            from '../prisma.service'
import { CreateOrderDto }                           from './dto/create-order.dto'
import { Prisma }                                   from '@prisma/client'

@Injectable()
export class OrdersService {
    constructor(public readonly prisma: PrismaService) {}

    async createOrder(userId: number, dto: CreateOrderDto) {
        // 1) Подтягиваем цены
        const ids = dto.items.map(i => i.menuItemId)
        const menuItems = await this.prisma.menuItem.findMany({
            where: { id: { in: ids } }
        })

        // 2) Составляем itemsData
        const itemsData = dto.items.map(i => {
            const mi = menuItems.find(m => m.id === i.menuItemId)
            const price = mi?.price ?? 0
            return {
                menuItemId:  i.menuItemId,
                quantity:    i.quantity,
                priceAtTime: price,
            }
        })

        // 3) Вычисляем total
        const total = itemsData.reduce((sum, it) => sum + it.priceAtTime * it.quantity, 0)

        try {
            // 4) Создаём заказ
            const order = await this.prisma.order.create({
                data: {
                    userId,
                    status:       'PENDING',
                    total,
                    payMethod:    dto.payMethod,
                    shippingInfo: dto.shippingInfo as unknown as Prisma.InputJsonValue,
                    comment:      dto.comment ?? null,
                    items: {
                        create: itemsData,
                    },
                },
                include: { items: true },
            })
            return order
        } catch (err) {
            throw new InternalServerErrorException('Не удалось создать заказ')
        }
    }

    async getUserOrders(userId: number) {
        return this.prisma.order.findMany({
            where:   { userId },
            include: { items: true },
            orderBy: { createdAt: 'desc' },
        })
    }
}