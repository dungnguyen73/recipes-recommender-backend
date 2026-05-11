import os, pickle, faiss, torch
import pandas as pd
from gensim.models import Word2Vec
from sklearn.feature_extraction.text import TfidfVectorizer
from dotenv import load_dotenv

load_dotenv()

model_version = os.getenv("MODEL_VERSION")
def load_recipes_csv():
    return pd.read_csv(os.path.join("models", "recipes.csv"), encoding="utf-8")

def load_content_features():
    with open(os.path.join("models", model_version,"content_features.pkl"), "rb") as f:
        return pickle.load(f)

def load_tfidf():
    with open(os.path.join("models",model_version, "tfidf.pkl"), "rb") as f:
        return pickle.load(f)

def load_w2v_model():
    return Word2Vec.load(os.path.join("models",model_version, "w2v.model"))

def load_faiss_index():
    return faiss.read_index(os.path.join("models",model_version, "recipe_index.faiss"))

def load_ncf_model():
    model = torch.load(os.path.join("models", model_version, "ncf_recipe_recommender.pth"), map_location=torch.device("cpu"))
    return model

def load_all():
    df = load_recipes_csv() 
    content_features = load_content_features()
    tfidf = load_tfidf()
    w2v_model = load_w2v_model()
    index = load_faiss_index()
    ncf_model = load_ncf_model()
    return df, content_features, tfidf, w2v_model, index, ncf_model
