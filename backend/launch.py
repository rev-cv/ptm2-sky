import uvicorn
from main import app
from config import SSL_CERT_FILE, SSL_KEY_FILE, SSL_ENABLED, IS_PRODACTION

if __name__ == "__main__":

    ssl_config = {}
    if SSL_ENABLED:
        if SSL_CERT_FILE and SSL_KEY_FILE:
            ssl_config = {
                "ssl_keyfile": SSL_KEY_FILE,
                "ssl_certfile": SSL_CERT_FILE
            }
        else:
            print("INFO:     ⚠️ SSL enabled but certificate paths not provided", flush=True)

    if IS_PRODACTION:
        print("INFO:     📡 SERVER RUNNING IN PRODUCTION MODE", flush=True)
        # Production - без reload
        uvicorn.run(app, host="0.0.0.0", port=3000, **ssl_config, reload=False)
    else:
        print("INFO:     ⚒️ SERVER RUNNING IN DEVELOPMENT MODE", flush=True)
        # Development - с reload (передается как строка для reload)
        uvicorn.run("main:app", host="0.0.0.0", port=3000, **ssl_config, reload=True)
