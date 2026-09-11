FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code and trained ML models
COPY . .

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

EXPOSE 8000

CMD exec uvicorn main:app --host 0.0.0.0 --port ${PORT}
