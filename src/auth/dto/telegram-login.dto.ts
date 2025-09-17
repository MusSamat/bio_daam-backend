// src/auth/dto/telegram-login.dto.ts
import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class TelegramLoginDto {
    @ApiProperty({
        description: 'Сырая строка initData из Telegram WebApp',
        example:
            'query_id=AAGR…&user=%7B%22id%22%3A466…%7D&auth_date=174860…&hash=abcdef123456…'
    })
    @IsString() @IsNotEmpty()
    initData!: string
}