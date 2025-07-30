
запуск сервера

```sh
uv run uvicorn main:app --reload --port 3000
```

добавить функцию-алиас в `.bashrc`
```bash
fastapi() {
  if [[ $1 == "run" ]]; then
    uv run uvicorn main:app --reload --port 3000
  else
    echo "Unknown command. Use 'fastapi run'."
  fi
}
```
и запускать
```sh
fastapi run
```

---

Запуск с ssl с помощью mkcert
```sh
sudo apt install libnss3-tools
sudo apt install mkcert
```

```sh
mkcert -install
```

```sh
mkcert localhost 127.0.0.1 ::1
```

```bash
uv run uvicorn main:app --host 0.0.0.0 --port 3000 --ssl-keyfile localhost+2-key.pem --ssl-certfile localhost+2.pem
```