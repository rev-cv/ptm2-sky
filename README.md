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

### Вариант 1: Запуск сервера через UV:

1. Запустить postgres
```sh
sudo docker run -d \
  --name postgres_db \
  -e POSTGRES_DB=myapp_dev \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  postgres:13
```

2. Запустить сервер из `backemd/`:
```
uv run launch.py
```

3. Запустить frontend на vite в режиме разработки из `frontend/`:
```sh
npm run dev
```
Запросы проксируются с 5173 на 3000.

Сборка frontend производится в статические файлы бекенда (backend/dist)
```sh
npm run build
```Запустить frontend на vite в режиме разработки из `frontend/`:
```sh
npm run dev
```
Запросы проксируются с 5173 на 3000.

Сборка frontend производится в статические файлы бекенда (backend/dist)
```sh
npm run build
```

### Вариант 2. Запустить сервер в docker из корня проекта:
```sh
sudo docker run -p 3000:3000 ptm:0.1.8
```

### Вариант 3.
По прежнему доступен старый вариант запуска:
```sh
uv run uvicorn main:app --host 0.0.0.0 --port 3000 --ssl-keyfile localhost+2-key.pem --ssl-certfile localhost+2.pem
```

---
## Запустить сервер в режиме PROD
```sh
sudo docker run -p 3000:3000 -e IS_PRODACTION=true ptm:0.1.8
```

---
## Запуск в docker-compose
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

---
## Деплой

1. перенести файлы проекта
2. в корне проекта создать `.env`и заполнить его
3. в корне проекта создать самоподписанные ключи ssl
```sh
mkdir -p project/certs
```
```sh
openssl req -x509 -newkey rsa:4096 -keyout certs/privkey.pem -out certs/fullchain.pem -days 365 -nodes -subj "/CN=localhost"
```
или получить бесплатные сертификаты 
```sh
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your_domain.com
``` 
и смонтировать путь к ним в файле `docker-compose.yml`
```yml
nginx:
  volumes:
    - /etc/letsencrypt/live/your_domain.com/fullchain.pem:/etc/nginx/certs/fullchain.pem:ro
    - /etc/letsencrypt/live/your_domain.com/privkey.pem:/etc/nginx/certs/privkey.pem:ro
```
4. Закоментировать `5432:5432`, т.к. на PROD доступ к базе нужен только внутри Docker-сети
```yml
ports:
  - "5432:5432"
```
5. в `nginx/nginx.conf` заменить `server_name localhost` на `server_name your_domain.com`
6. настроить DNS-запись (A или CNAME), чтобы она указывала на IP-адрес сервера
7. запуск контейнера
```sh
sudo docker-compose build --no-cache
```
```sh
sudo docker-compose up -d
```