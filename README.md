# RecipeLens Backend

Welcome to the general backend repository for the **RecipeLens** application. This project uses a microservices-oriented architecture to deliver a robust backend for recipe management, ingredient detection, and personalized recipe recommendations.

## 🏗️ Project Structure

The repository is divided into two main services and a shared infrastructure setup:

- **`app-backend/`**: The core API service built with **NestJS**. It handles user authentication, recipe management, and acts as a gateway to the AI and recommendation services.
- **`recommendation-service/`**: The AI recommendation engine built with **FastAPI**. It runs Machine Learning models (NCF & Content-Based) and manages MLOps pipelines using ZenML.
- **`docker-compose.yaml`**: The container orchestration file that spins up the Roboflow Inference Server for ingredient object detection.

## 🚀 Tech Stack

- **Core API**: NestJS, TypeScript, MongoDB (Mongoose)
- **AI & ML**: FastAPI, Python 3.10+, PyTorch, Scikit-Learn, FAISS, Gensim, ZenML
- **Computer Vision**: Roboflow Inference Server
- **Authentication**: JWT, bcrypt

## ✨ Features

- **Microservice Architecture**: Clear separation of concerns between core logic and heavy ML processing.
- **Ingredient Detection**: Integrates with Roboflow to detect ingredients from images.
- **Smart Recommendations**: Hybrid recommendation system combining Neural Collaborative Filtering (NCF) and Content-based filtering.
- **MLOps Integration**: End-to-end ML pipelines tracked and managed by ZenML.
- **Secure & Scalable**: JWT-based authentication and modular NestJS architecture ready to scale.

## 🏃 Getting Started

### 1. Start the Inference Server
To start the Roboflow inference server for ingredient detection:
```bash
docker-compose up -d
```

### 2. Start the Recommendation Service
Refer to the `recommendation-service/README.md` for detailed instructions on setting up the Python environment, installing dependencies, and running the FastAPI server and ZenML pipelines.

### 3. Start the Core App Backend
Refer to the `app-backend/README.md` for details on installing npm dependencies, configuring environment variables, and starting the NestJS server.
