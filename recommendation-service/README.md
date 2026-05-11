# RecipeLens Recommendation Service

The AI and Machine Learning backbone of RecipeLens. Built with **FastAPI**, this service provides high-performance endpoints for fetching personalized recipe recommendations using a hybrid approach. It also includes comprehensive MLOps pipelines using **ZenML**.

## 🏗️ Project Structure

- **`app/`**: Contains the FastAPI application, model loading scripts, and the core recommendation logic.
- **`pipeline/`**: Contains ZenML pipelines for training and evaluating models.
  - `ncf/`: Neural Collaborative Filtering pipeline.
  - `content_based/`: Content-based filtering pipeline.
- **`models/`**: Directory for storing saved PyTorch weights, FAISS indices, and other model artifacts.

## 🚀 Tech Stack

- **Framework**: FastAPI, Python 3.10+
- **Machine Learning**: PyTorch (for NCF), Scikit-Learn, Gensim, FAISS, RapidFuzz
- **NLP**: SpaCy, NLTK
- **MLOps**: ZenML
- **Data Manipulation**: Pandas, NumPy

## ✨ Features

- **Hybrid Recommendation Engine**: Combines NCF for collaborative filtering and TF-IDF/FAISS for content-based similarity.
- **High-Speed Vector Search**: Utilizes FAISS for lightning-fast similarity lookups.
- **Automated MLOps**: End-to-end training and inference pipelines managed via ZenML.
- **NLP Processing**: Extracts and processes ingredients and tags using SpaCy and NLTK.

## 🛠️ Installation & Setup

1. **Create and activate a virtual environment (Python 3.10+ recommended):**
   ```bash
   py -3.10 -m venv venv310
   .\venv310\Scripts\activate
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Download required NLP resources:**
   ```bash
   python -m nltk.downloader punkt wordnet stopwords
   python -m spacy download en_core_web_sm
   ```

## 🏃 Running the Server

Start the FastAPI application with Uvicorn:
```bash
python -m uvicorn app.main:app --reload --port 8001
```

## 🤖 Running ZenML Pipelines

1. **Initialize ZenML locally:**
   ```bash
   zenml login --local --blocking
   ```

2. **Run the NCF Pipeline:**
   ```bash
   python -m pipeline.ncf.run_pipeline
   ```

3. **Run the Content-Based Pipeline:**
   ```bash
   python -m pipeline.content_based.run_pipeline
   ```

*Dashboard URL for Pipeline Run examples:*
`https://tduq-recipelens-recommender.hf.space/runs/<run_id>`