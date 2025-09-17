// src/orders/dto/create-order.dto.ts
import { ApiProperty } from '@nestjs/swagger'
import {
    IsNumber,
    IsArray,
    ValidateNested,
    IsString,
    IsOptional,
    IsInt,
    Min, IsNotEmpty,
} from 'class-validator'
import { Type } from 'class-transformer'

class OrderItemDto {
    @ApiProperty({ description: 'ID пункта меню' })
    @IsInt() @Min(1)
    menuItemId!: number

    @ApiProperty({ description: 'Количество' })
    @IsInt() @Min(1)
    quantity!: number
}

class ShippingInfoDto {
    @ApiProperty({ description: 'Улица и дом' })
    @IsString() @IsNotEmpty()
    address1!: string

    @ApiProperty({ description: 'Квартира, корпус', required: false })
    @IsOptional() @IsString()
    address2?: string

    @ApiProperty({ description: 'Город' })
    @IsString() @IsNotEmpty()
    city!: string

    @ApiProperty({ description: 'Почтовый код' })
    @IsString() @IsNotEmpty()
    postCode!: string
}

export class CreateOrderDto {
    @ApiProperty({ description: 'ID авторизованного Telegram-пользователя' })
    @IsNumber()
    userId!: number

    @ApiProperty({ type: [OrderItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items!: OrderItemDto[]

    @ApiProperty({ description: 'Метод оплаты', enum: ['Наличные', 'Карта'] })
    @IsString()
    payMethod!: 'Наличные' | 'Карта'

    @ApiProperty({ type: ShippingInfoDto })
    @ValidateNested()
    @Type(() => ShippingInfoDto)
    shippingInfo!: ShippingInfoDto

    @ApiProperty({ description: 'Комментарий', required: false })
    @IsOptional() @IsString()
    comment?: string
}