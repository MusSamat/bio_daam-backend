// test-hmac.js
const crypto = require('crypto');

// 1) Берём токен БЕЗ пробелов (в скрипте продублируйте ровно из .env, без кавычек!)
const botToken = '7628156041:AAE-oSd1YXIBEDjR1blR7jPXYdUyOm3yO7Y'.trim();

// 2) Формируем secretKey
const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();

// 3) Копируем точно dataCheckString из логов
const dataCheckString = [
    'auth_date=1748703418',
    'query_id=AAGR5ssbAAAAAJHmyxsPwFVO',
    'user={"id":466347665,"first_name":"M Samat","last_name":"","username":"Msamat","language_code":"en","allows_write_to_pm":true,"photo_url":"https://t.me/i/userpic/320/QtGH4ZdqPnP7D438PuF5-n03IIyASKBH40glEgFF878.svg"}'
].join('\n');

console.log('dataCheckString =', dataCheckString);

// 4) Вычисляем HMAC
const ourHash = crypto.createHmac('sha256', secretKey).update(dataCheckString).digest('hex');
console.log('ourHash =', ourHash);

// Сравните вывод с providedHash: d4fa7a811ccccc04441043f700b676941160b6d8c30dfcb724838000f73960d0