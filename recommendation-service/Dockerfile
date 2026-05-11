# Use an official Python runtime as the base image
FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Install system dependencies required for building some Python packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    g++ \
    libopenblas-dev \
    libomp-dev \
    python3-dev \
    libffi-dev \
    libssl-dev \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy and install dependencies in a single step to optimize Docker caching
COPY requirements.txt /app/requirements.txt
RUN pip install -r requirements.txt

RUN python -m nltk.downloader punkt wordnet stopwords punkt_tab
RUN python -m spacy download en_core_web_sm

COPY . /app

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
