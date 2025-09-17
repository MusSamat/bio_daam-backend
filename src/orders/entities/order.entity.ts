import { ApiProperty } from '@nestjs/swagger'

export class OrderItemEntity {
    @ApiProperty() id!: number
    @ApiProperty() menuItemId!: number
    @ApiProperty() quantity!: number
    @ApiProperty() priceAtTime!: number
}

export class OrderEntity {
    @ApiProperty() id!: number
    @ApiProperty() userId!: number
    @ApiProperty() items!: OrderItemEntity[]
    @ApiProperty() status!: string
    @ApiProperty() total!: number
    @ApiProperty() createdAt!: Date
}