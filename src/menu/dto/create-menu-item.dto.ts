import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNumber, IsOptional, IsUrl, Min } from 'class-validator'

export class CreateMenuItemDto {
    @ApiProperty({ example: 'Бешбармак', description: 'Русское название блюда' })
    @IsString()
    nameRu!: string

    @ApiProperty({ example: 'Beshbarmak', description: 'English name' })
    @IsString()
    nameEn!: string

    @ApiProperty({ example: 'Бешбармак (kg)', description: 'Кыргызское название' })
    @IsString()
    nameKg!: string

    @ApiProperty({ example: 10, description: 'Цена в USD' })
    @IsNumber()
    @Min(0)
    price!: number

    @ApiProperty({ example: '/images/beshbarmak.png', description: 'URL иконки' })
    @IsUrl()
    iconUrl!: string

    @ApiProperty({ example: 'Традиционное киргизское блюдо…', description: 'Описание на русском', required: false })
    @IsOptional()
    @IsString()
    descriptionRu?: string

    @ApiProperty({ example: 'Traditional dish…', description: 'English description', required: false })
    @IsOptional()
    @IsString()
    descriptionEn?: string

    @ApiProperty({ example: '…описание на кыргызском…', description: 'Описание на кыргызском', required: false })
    @IsOptional()
    @IsString()
    descriptionKg?: string
}