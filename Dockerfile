# Базовый образ Node.js
FROM node:18

# Рабочая директория
WORKDIR /bio_daam-backend

# Копируем зависимости
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Глобально устанавливаем TypeScript и Nest CLI
RUN npm install -g typescript @nestjs/cli

# Копируем остальной код
COPY . .

# Копируем tsconfig.base.json, если он выше по структуре
COPY ../../tsconfig.base.json ./tsconfig.base.json

# Собираем проект
RUN npm run build

# Запускаем приложение
CMD ["node", "dist/apps/api/main"]