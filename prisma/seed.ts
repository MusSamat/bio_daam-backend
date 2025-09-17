// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    const items = [
        {
            id: 1,
            nameRu: 'Бешбармак',
            nameEn: 'Beshbarmak',
            nameKg: 'Бешбармак (kg)',
            price: 10,
            imageUrl: '/images/beshbarmak.png',
            descriptionRu: 'Традиционное киргизское блюдо из лапши и мяса',
            descriptionEn: 'Traditional Kyrgyz noodle and meat dish',
            descriptionKg: '…описание на кыргызском…',
        },
        {
            id: 2,
            nameRu: 'Суп',
            nameEn: 'Soup',
            nameKg: 'Суп (kg)',
            price: 5,
            imageUrl: '/images/soup.png',
            descriptionRu: 'Горячий наваристый бульон',
            descriptionEn: 'Hot hearty broth',
            descriptionKg: '…описание на кыргызском…',
        },
        // …добавьте остальные пункты (Манты, Плов, Лагман) …
    ]

    for (const it of items) {
        await prisma.menuItem.upsert({
            where: { id: it.id },
            update: it,
            create: it,
        })
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(() => prisma.$disconnect())