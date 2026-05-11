# RecipeLens Core App Backend

The Core API service for RecipeLens, built with the [NestJS](https://nestjs.com/) framework. This service acts as the central hub for user requests, database interactions, and communication with the AI microservices.

## 🏗️ Architecture & Modules

The application follows a modular architecture:
- **`auth/` & `users/`**: Manages JWT authentication, password hashing with bcrypt, and user profiles.
- **`recipes/`**: Handles CRUD operations for recipes.
- **`detection/`**: Integrates with the Roboflow Inference Server to analyze images and extract ingredients.
- **`recommender/`**: Communicates with the Python-based `recommendation-service` to fetch personalized recipe suggestions.

## 🚀 Tech Stack

- **Framework**: NestJS (TypeScript)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT & Bcrypt
- **API Documentation**: Swagger UI

## ✨ Features

- **RESTful API**: Clean and documented endpoints for client consumption.
- **Authentication**: Secure user login and registration.
- **Ingredient Detection Gateway**: Relays images to the local Docker-based inference server and parses results.
- **Recommendation Gateway**: Fetches and formats AI recommendations.

## 🛠️ Installation

```bash
$ npm install
```

## 🏃 Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## 🧪 Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
