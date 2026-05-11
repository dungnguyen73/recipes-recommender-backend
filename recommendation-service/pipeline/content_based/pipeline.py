import numpy as np
from zenml import pipeline
from .steps.data_loader import load_recipe_data
from .steps.preprocessing import preprocess_ingredients
from .steps.train_embeddings import train_embeddings
from .steps.train_faiss import build_faiss_index
from .steps.save_models import save_models

@pipeline
def content_based_pipeline():
    df = load_recipe_data()
    clean_df = preprocess_ingredients(df)
    tfidf, w2v, features = train_embeddings(clean_df)

    recipe_ids = clean_df["RecipeId"].to_numpy(dtype=np.int64)

    index = build_faiss_index(features=features, recipe_ids=recipe_ids)
    
    index = build_faiss_index(features)
    save_models(tfidf=tfidf, w2v=w2v, index=index)
