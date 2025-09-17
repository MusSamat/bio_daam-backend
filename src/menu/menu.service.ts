// src/menu/menu.service.ts

import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import type { MenuItem } from '@prisma/client'
import { CreateMenuItemDto } from './dto/create-menu-item.dto'
import { UpdateMenuItemDto } from './dto/update-menu-item.dto'
import { LocalizedMenuItemDto } from './dto/localized-menu-item.dto'

type Lang = 'ru' | 'en' | 'kg'

@Injectable()
export class MenuService {
    constructor(private readonly prisma: PrismaService) {}

    /** Получить все необработанные записи из БД */
    async getMenuItems(): Promise<MenuItem[]> {
        return this.prisma.menuItem.findMany()
    }

    /** Получить одну запись по ID */
    async getMenuItemById(id: number): Promise<MenuItem> {
        const item = await this.prisma.menuItem.findUnique({ where: { id } })
        if (!item) {
            throw new NotFoundException(`MenuItem с id=${id} не найден`)
        }
        return item
    }

    /** Создать новый пункт меню */
    async createMenuItem(dto: CreateMenuItemDto): Promise<MenuItem> {
        return this.prisma.menuItem.create({ data: dto as any })
    }

    /** Обновить существующий пункт меню */
    async updateMenuItem(id: number, dto: UpdateMenuItemDto): Promise<MenuItem> {
        // проверяем, что запись существует
        await this.getMenuItemById(id)
        return this.prisma.menuItem.update({
            where: { id },
            data: dto as any,
        })
    }

    /** Удалить пункт меню */
    async deleteMenuItem(id: number): Promise<void> {
        // проверяем, что запись существует
        await this.getMenuItemById(id)
        await this.prisma.menuItem.delete({ where: { id } })
    }

    /**
     * Локализовать массив MenuItem в DTO в зависимости от языка
     */
    localize(items: MenuItem[], lang: Lang): LocalizedMenuItemDto[] {
        return items.map(item => this.localizeOne(item, lang))
    }

    /**
     * Локализовать один MenuItem
     */
    localizeOne(item: MenuItem, lang: Lang): LocalizedMenuItemDto {
        let name: string
        let description: string | null

        switch (lang) {
            case 'en':
                name        = item.nameEn
                description = item.descriptionEn ?? null
                break
            case 'kg':
                name        = item.nameKg
                description = item.descriptionKg ?? null
                break
            default:
                name        = item.nameRu
                description = item.descriptionRu ?? null
        }

        return {
            id:          item.id,
            name,
            price:       item.price,
            imageUrl:    item.imageUrl,
            description,
        }
    }
}