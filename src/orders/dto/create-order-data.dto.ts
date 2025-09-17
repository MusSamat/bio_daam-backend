import { ApiProperty } from '@nestjs/swagger'
import {
    IsArray,
    ValidateNested,
    IsNumber,
    IsString,
    IsOptional,
} from 'class-validator'
import { Type } from 'class-transformer'

export class OrderItemDto {
    @ApiProperty({ example: 1, description: 'ID пункта меню' })
    @IsNumber() menuItemId!: number

    @ApiProperty({ example: 2, description: 'Количество' })
    @IsNumber() quantity!: number
}

export class CreateOrderDataDto {
    @ApiProperty({ type: [OrderItemDto], description: 'Список позиций заказа' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items!: OrderItemDto[]

    @ApiProperty({ example: 'Наличные', description: 'Способ оплаты' })
    @IsString() payMethod!: string

    @ApiProperty({
        example: { address1: 'ул. Ленина, 10', city: 'Бишкек', postCode: '720000' },
        description: 'Информация о доставке',
    })
    shippingInfo!: Record<string, any>

    @ApiProperty({ example: 'Комментарий к заказу', required: false })
    @IsOptional()
    @IsString()
    comment?: string
}