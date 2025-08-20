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

# Используем --python-preference only-system чтобы uv использовал уже установленный Python
RUN pip install --trusted-host pypi.org --trusted-host pypi.python.org --trusted-host files.pythonhosted.org -e .

COPY .env .
COPY backend/ .

EXPOSE 3000

CMD ["python", "launch.py"]
