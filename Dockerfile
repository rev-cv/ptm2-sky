FROM python:3.12-slim
WORKDIR /app

# ОТКЛЮЧИТЬ SSL ПРОВЕРКУ
ENV UV_SSL_NO_VERIFY=1
ENV SSL_CERT_FILE=""
ENV PYTHONHTTPSVERIFY=0
ENV UV_NO_SYNC=1
ENV UV_PYTHON_PREFERENCE=only-system

RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    gcc \
    g++ \
    make \
    git \
    libopenblas-dev \
    && rm -rf /var/lib/apt/lists/*

COPY backend/pyproject.toml .
COPY backend/uv.lock .

RUN pip install --no-cache-dir .

COPY .env .
COPY backend/ .

EXPOSE 3000

CMD ["python", "launch.py"]
