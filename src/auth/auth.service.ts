import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as crypto from 'crypto';
import type { User } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) {}

    /**
     * Validates Telegram WebApp login data and returns or creates a user.
     * @param initDataRaw - The raw initialization data string from Telegram WebApp.
     * @returns A Promise resolving to the authenticated User object.
     * @throws BadRequestException if initDataRaw is invalid or missing required fields.
     * @throws UnauthorizedException if the hash doesn't match or auth_date is too old.
     */
    async validateTelegramLogin(initDataRaw: string): Promise<User> {
        // Check if initDataRaw is provided
        if (!initDataRaw) {
            throw new BadRequestException('Missing initData');
        }

        // Retrieve bot token from environment variables
        const botToken = process.env.TELEGRAM_BOT_TOKEN;
        if (!botToken) {
            throw new UnauthorizedException('TELEGRAM_BOT_TOKEN is not configured');
        }

        // Step 1: Parse the raw initData string
        const params = new URLSearchParams(initDataRaw);

        // Step 2: Extract and remove the hash
        const providedHash = params.get('hash');
        if (!providedHash) {
            throw new BadRequestException('Missing hash in initData');
        }
        params.delete('hash');

        // Step 3: Sort key-value pairs alphabetically by key
        const sortedParams = Array.from(params.entries()).sort(([a], [b]) => a.localeCompare(b));

        // Step 4: Create data-check-string
        const dataCheckString = sortedParams.map(([key, value]) => `${key}=${value}`).join('\n');

        // Step 5: Generate secret key (HMAC-SHA256 of botToken with "WebAppData" as key)
        const secret = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();

        // Step 6: Compute HMAC-SHA256 of data-check-string using the secret
        const computedHash = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');

        // Debugging logs (remove or use a logger like Winston in production)
        console.log('Debug - dataCheckString:', dataCheckString);
        console.log('Debug - computedHash:', computedHash);
        console.log('Debug - providedHash:', providedHash);

        // Step 7: Verify the hash
        if (computedHash !== providedHash) {
            console.error('Hash validation failed', { computedHash, providedHash });
            throw new UnauthorizedException('Invalid Telegram data');
        }

        // Additional validation: Check auth_date freshness (max 24 hours old)
        const authDateStr = params.get('auth_date');
        if (!authDateStr) {
            throw new BadRequestException('Missing auth_date in initData');
        }
        const authDate = Number(authDateStr);
        if (isNaN(authDate)) {
            throw new BadRequestException('Invalid auth_date format');
        }
        const now = Math.floor(Date.now() / 1000);
        if (now - authDate > 86400) {
            throw new UnauthorizedException('Telegram authorization expired');
        }

        // Parse user data
        const userJson = params.get('user');
        if (!userJson) {
            throw new BadRequestException('Missing user data in initData');
        }
        let userData: any;
        try {
            userData = JSON.parse(userJson);
        } catch (error) {
            throw new BadRequestException('Invalid user data format');
        }

        // Upsert user in the database
        const telegramId = String(userData.id);
        let user = await this.prisma.user.findUnique({ where: { telegramId } });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    telegramId,
                    firstName: userData.first_name || null,
                    lastName: userData.last_name || null,
                    username: userData.username || null,
                },
            });
        }

        return user;
    }
}