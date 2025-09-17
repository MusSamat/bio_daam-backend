import { Controller, Get } from '@nestjs/common'

@Controller('admin')
export class AdminController {
    /**
     * GET /admin
     * Простейшая заглушка «админки»
     */
    @Get()
    getAdminPanel() {
        return {
            message: 'Добро пожаловать в админ-панель!',
            timestamp: new Date().toISOString(),
        }
    }
}