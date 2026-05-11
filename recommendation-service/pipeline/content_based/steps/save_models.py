from dotenv import load_dotenv
from zenml import step
import joblib
import faiss
import os
from gensim.models import Word2Vec
from sklearn.feature_extraction.text import TfidfVectorizer
from typing import Tuple
load_dotenv()

@step
def save_models(
    tfidf: TfidfVectorizer,
    w2v: Word2Vec,
    index: faiss.IndexFlatIP,
) -> None:
    model_version = os.getenv("SAVED_PIPELINE_BUILD_MODEL_FOLDER")
    # model_version = "v16"
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
    save_dir = os.path.join(root_dir, 'models',model_version )
    os.makedirs(save_dir, exist_ok=True)

    # Save TF-IDF
    joblib.dump(tfidf, os.path.join(save_dir, "tfidf.pkl"))

    # Save Word2Vec
    w2v.save(os.path.join(save_dir, "w2v.model"))

    # Save FAISS index
    faiss.write_index(index, os.path.join(save_dir, "recipe_index.index"))

    print(f"Models saved to: {save_dir}")
