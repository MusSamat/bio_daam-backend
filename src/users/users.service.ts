import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByTelegramId(telegramId: string | undefined): Promise<User | null> {
    return this.usersRepository.findOne({ where: { telegramId } });
  }

  async createOrUpdate(userData: Partial<User>): Promise<User> {
    const user = await this.findByTelegramId(userData.telegramId);
    if (user) {
      return this.usersRepository.save({ ...user, ...userData });
    }
    return this.usersRepository.save(this.usersRepository.create(userData));
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
