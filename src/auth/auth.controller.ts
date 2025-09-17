// src/auth/auth.controller.ts
import { Controller, Post, Body, BadRequestException } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse }          from '@nestjs/swagger'
import { AuthService }                                 from './auth.service'
import { TelegramLoginDto }                            from './dto/telegram-login.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('telegram')
    @ApiOperation({ summary: 'Авторизация через Telegram WebApp (initData)' })
    @ApiResponse({ status: 200, description: 'Успешная валидация, возвращает userId' })
    @ApiResponse({ status: 401, description: 'Неверные данные Telegram' })
    async loginWithTelegram(@Body() dto: TelegramLoginDto) {
        let user
        try {
            user = await this.authService.validateTelegramLogin(dto.initData)
        } catch (e: any) {
            // вернёт { message, statusCode:400 } по умолчанию,
            // можно заменить на UnauthorizedException, если хочется 401
            throw new BadRequestException(e.message)
        }
        // Возвращаем только userId — фронт может хранить его у себя
        return { userId: user.id }
    }
}