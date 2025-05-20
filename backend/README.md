
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
