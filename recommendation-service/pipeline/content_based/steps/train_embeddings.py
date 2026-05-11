from typing import Tuple
import pandas as pd
from zenml import step
from sklearn.feature_extraction.text import TfidfVectorizer
from gensim.models import Word2Vec
import numpy as np
from scipy.sparse import hstack

@step(enable_cache=True)
def train_embeddings(df: pd.DataFrame) -> Tuple[TfidfVectorizer, Word2Vec, np.ndarray]:
    tfidf = TfidfVectorizer(max_features=1000)
    tfidf_matrix = tfidf.fit_transform(df["ingredient_clean"])

    sentences = df["ingredient_clean"].apply(lambda x: x.split(", "))
    w2v = Word2Vec(sentences, vector_size=200, window=5, min_count=1, workers=4)
    
    def get_w2v_embedding(tokens):
        vectors = [w2v.wv[token] for token in tokens if token in w2v.wv]
        return np.mean(vectors, axis=0) if vectors else np.zeros(200)
    
    w2v_matrix = np.array([get_w2v_embedding(x.split(", ")) for x in df["ingredient_clean"]])
    combined = hstack([tfidf_matrix, w2v_matrix]).toarray().astype("float32")
    return tfidf, w2v, combined
