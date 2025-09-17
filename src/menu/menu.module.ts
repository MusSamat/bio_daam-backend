import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma.module'
import { MenuService } from './menu.service'
import { MenuController } from './menu.controller'

@Module({
    imports: [PrismaModule],
    providers: [MenuService],
    controllers: [MenuController],
})
export class MenuModule {}