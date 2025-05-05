import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('auth')
  async auth(@Body() data: { telegramId: string; firstName: string }) {
    return this.usersService.createOrUpdate(data);
  }
}
