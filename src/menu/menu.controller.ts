// src/menu/menu.controller.ts
import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    Query,
    ParseIntPipe,
    UseGuards,
} from '@nestjs/common'
import {
    ApiTags,
    ApiOperation,
    ApiQuery,
    ApiParam,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger'

import { MenuService } from './menu.service'
import { LocalizedMenuItemDto } from './dto/localized-menu-item.dto'
import { CreateMenuItemDto } from './dto/create-menu-item.dto'
import { UpdateMenuItemDto } from './dto/update-menu-item.dto'

import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard'
import { RolesGuard }   from '../auth/guard/roles.guard'
import { Roles }        from '../auth/decorators/roles.decorator'

type Lang = 'ru' | 'en' | 'kg'

@ApiTags('menu')
@Controller('menu')
export class MenuController {
    constructor(private readonly menuService: MenuService) {}

    // === Public read endpoints ===

    @Get()
    @ApiOperation({ summary: 'Получить все пункты меню (локализация через ?lang)' })
    @ApiQuery({
        name: 'lang',
        required: false,
        example: 'ru',
        description: 'Язык локализации (ru | en | kg)',
    })
    @ApiResponse({ status: 200, description: 'Успешно', type: [LocalizedMenuItemDto] })
    async getMenu(
        @Query('lang') lang: Lang = 'ru',
    ): Promise<LocalizedMenuItemDto[]> {
        const items = await this.menuService.getMenuItems()
        return this.menuService.localize(items, lang)
    }

    @Get(':id')
    @ApiOperation({ summary: 'Получить пункт меню по ID (локализация через ?lang)' })
    @ApiParam({ name: 'id', example: 1, description: 'ID пункта меню' })
    @ApiQuery({
        name: 'lang',
        required: false,
        example: 'ru',
        description: 'Язык локализации (ru | en | kg)',
    })
    @ApiResponse({ status: 200, description: 'Успешно', type: LocalizedMenuItemDto })
    async getOne(
        @Param('id', ParseIntPipe) id: number,
        @Query('lang') lang: Lang = 'ru',
    ): Promise<LocalizedMenuItemDto> {
        const item = await this.menuService.getMenuItemById(id)
        return this.menuService.localizeOne(item, lang)
    }

    // === Protected admin endpoints ===

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @Post()
    @ApiOperation({ summary: 'Создать новый пункт меню (Admin)' })
    @ApiResponse({ status: 201, description: 'Пункт создан', type: LocalizedMenuItemDto })
    async create(
        @Body() dto: CreateMenuItemDto,
        @Query('lang') lang: Lang = 'ru',
    ): Promise<LocalizedMenuItemDto> {
        const item = await this.menuService.createMenuItem(dto)
        return this.menuService.localizeOne(item, lang)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @Put(':id')
    @ApiOperation({ summary: 'Обновить пункт меню (Admin)' })
    @ApiParam({ name: 'id', example: 1, description: 'ID обновляемого пункта' })
    @ApiResponse({ status: 200, description: 'Пункт обновлён', type: LocalizedMenuItemDto })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateMenuItemDto,
        @Query('lang') lang: Lang = 'ru',
    ): Promise<LocalizedMenuItemDto> {
        const item = await this.menuService.updateMenuItem(id, dto)
        return this.menuService.localizeOne(item, lang)
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @Delete(':id')
    @ApiOperation({ summary: 'Удалить пункт меню (Admin)' })
    @ApiParam({ name: 'id', example: 1, description: 'ID удаляемого пункта' })
    @ApiResponse({ status: 204, description: 'Пункт удалён' })
    async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        await this.menuService.deleteMenuItem(id)
    }
}