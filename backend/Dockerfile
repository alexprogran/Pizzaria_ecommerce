FROM python:3.11

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
COPY entrypoint.sh .

RUN pip install --upgrade pip && pip install -r requirements.txt && \
    chmod +x /app/entrypoint.sh

COPY . .

CMD ["/app/entrypoint.sh"]


