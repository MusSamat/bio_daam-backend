import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { AuthService } from '../auth.service'

@Injectable()
export class TelegramAuthGuard implements CanActivate {
    constructor(private authService: AuthService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const body = request.body

        // Поддерживаем как вложенные, так и плоские структуры
        const dto = body.telegramAuth || body
        try {
            const user = await this.authService.validateTelegramLogin(dto)
            request.user = user
            return true
        } catch (e) {
            let errorMessage = 'Неизвестная ошибка аутентификации'
            if (e instanceof Error) {
                errorMessage = e.message
            } else if (typeof e === 'string') {
                errorMessage = e
            }
            throw new UnauthorizedException(errorMessage)
        }
    }
}