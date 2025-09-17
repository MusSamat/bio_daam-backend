// src/auth/auth.module.ts
import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule }      from '@nestjs/jwt'
import { PrismaModule }   from '../prisma.module'

import { AuthService }         from './auth.service'
import { AuthController }      from './auth.controller'
import { JwtStrategy }         from './strategy/jwt.strategy'

import { TelegramAuthGuard }   from './guard/telegram-auth.guard'
import { JwtAuthGuard }        from './guard/jwt-auth.guard'
import { RolesGuard }          from './guard/roles.guard'

@Module({
    imports: [
        PrismaModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: process.env.JWT_SECRET || 'change_me',
            signOptions: { expiresIn: '30d' },
        }),
    ],
    providers: [
        AuthService,
        JwtStrategy,
        TelegramAuthGuard,    // ← добавили
        JwtAuthGuard,         // ← добавили
        RolesGuard,           // ← добавили
    ],
    controllers: [AuthController],
    exports: [
        AuthService,
        TelegramAuthGuard,    // ← экспорт Guard’ов
        JwtAuthGuard,
        RolesGuard,
    ],
})
export class AuthModule {}