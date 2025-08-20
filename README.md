# ptm2-sky

## Использованные ресурсы
- иконки: [Solar](https://icon-sets.iconify.design/solar/)
- шрифт: [Nunito](https://fonts.google.com/specimen/Nunito)

---
## Сгенерировать image
```sh
sudo docker build -t ptm:0.1.8 .
```

## Запустить сервер в режиме DEV

Проще запустить без docker:
```
uv run launch.py
```

Можно запустить в docker:
```sh
sudo docker run -p 3000:3000 ptm:0.1.8
```

Запустить frontend на vite в режиме разработки
```sh
npm run dev
```
Запросы проксируются с 5173 на 3000.

Сборка frontend производится в статические файлы бекенда (backend/dist)
```sh
npm run build
```

---
## Запустить сервер в режиме PROD
```sh
sudo docker run -p 3000:3000 -e IS_PRODACTION=true ptm:0.1.8
```

---
## Запуст в docker-compose
```sh
sudo docker-compose build --no-cache backend
```
```sh
sudo docker-compose up
```

---
## Описание файла .env

Расположен в корне проекта и содержит следующие поля

- `VITE_API_URL=` - пустое поле (наследство)
- `VITE_WS_URL=wss://localhost:3000`

- `IS_PRODACTION=false` - true или false. Если false, то запускает в режиме realad 

- `DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DBNAME"`
- `POSTGRES_DB=DBNAME`
- `POSTGRES_USER=USER`
- `POSTGRES_PASSWORD=PASSWORD`

- `JWT_SECRET_KEY="секретный ключ"` - ключ шифрования токена
- `JWT_ALGORITHM=HS256` - алгоритм шифрования токена
- `JWT_ACCESS_TOKEN_EXPIRE_MINUTES=100` - минуты в пределах которого действителен токен доспуа
- `JWT_REFRESH_TOKEN_EXPIRE_DAYS=100` - дни в пределах которого действителен refresh токен

- `TASKS_PAGE_SIZE=30` - число для пагинации страниц

- `OPENROUTER_AI_URL=https://openrouter.ai/api/v1`
- `OPENROUTER_AI_KEY=KEY` - API от OpenRouter
- `OPENROUTER_AI_MODEL=deepseek/deepseek-r1-0528:free` - название модели

пути к файлам ssl (под вопросм пока)
- `SSL_CERT_FILE=localhost+2.pem`
- `SSL_KEY_FILE=localhost+2-key.pem`
- `SSL_ENABLED=true` true или false