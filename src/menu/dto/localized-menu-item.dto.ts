// src/menu/dto/localized-menu-item.dto.ts
import { ApiProperty } from '@nestjs/swagger'

export class LocalizedMenuItemDto {
    @ApiProperty({ example: 1, description: 'ID пункта меню' })
    id!: number

    @ApiProperty({ example: 'Бешбармак', description: 'Название блюда' })
    name!: string

    @ApiProperty({ example: 10.5, description: 'Цена блюда' })
    price!: number

    @ApiProperty({ example: '/images/beshbarmak.png', description: 'URL изображения' })
    imageUrl!: string

    @ApiProperty({
        example: 'Традиционное киргизское блюдо…',
        description: 'Описание блюда',
        nullable: true,
    })
    description!: string | null
}