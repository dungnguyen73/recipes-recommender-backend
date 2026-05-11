import numpy as np
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from rapidfuzz import fuzz

from app.utils.interactiondata_handler import *

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

BETA = 0.5  # Weight for user history in hybrid recommendation


def compute_coverage_fuzzy(query_set, recipe_set, threshold=50):
    """
    Compute coverage using fuzzy string matching.

    :param query_set: iterable of preprocessed query ingredients (strings)
    :param recipe_set: iterable of recipe ingredients (strings)
    :param threshold: minimum fuzz ratio (%) to consider a match
    :return: coverage score = matched_recipe_tokens / total_recipe_tokens
    """
    if not recipe_set:
        return 0.0

    matched = 0
    for recipe_ing in recipe_set:
        for query_ing in query_set:
            score = fuzz.token_sort_ratio(query_ing, recipe_ing)
            if score >= threshold:
                print("Compare : ", recipe_ing, " - ", query_ing, " - score: ", score)
                matched += 1
                break

    return matched / len(recipe_set)


def compute_fit_score(tokens: list[str], w2v_model, sim_threshold: float = None) -> float:
    """
    Tính fit score của một recipe dựa trên embedding của từng ingredient.
    Với mỗi ingredient i:
      1. Lấy vector v_i.
      2. Lấy trung bình các vector còn lại mean_others.
      3. Tính cosine similarity giữa v_i và mean_others.
    Fit score cuối cùng là trung bình các cosine similarity này.
    Nếu sim_threshold != None, chỉ tính các similarity >= threshold.
    """
    # Lấy các vector của tokens có trong model
    vecs = [w2v_model.wv[t] for t in tokens if t in w2v_model.wv]
    n = len(vecs)
    if n < 2:
        return 0.0

    vecs = np.stack(vecs, axis=0)
    sims = []
    for i in range(n):
        v_i = vecs[i]
        others = np.delete(vecs, i, axis=0)
        mean_others = np.mean(others, axis=0)

        num = np.dot(v_i, mean_others)
        denom = np.linalg.norm(v_i) * np.linalg.norm(mean_others)
        if denom == 0:
            continue

        sim = num / denom
        if sim_threshold is None or sim >= sim_threshold:
            sims.append(sim)

    return float(np.mean(sims)) if sims else 0.0


def compute_coverage(query_set, recipe_set, w2v_model, sim_threshold=0.85):
    """
    Compute coverage using semantic similarity with Word2Vec.
    
    :param query_set: Set of user-provided ingredients (e.g.,"chicken, rice").
    :param recipe_set: Set of recipe ingredients (e.g., {"chicken breast", "rice", "salt"}).
    :param w2v_model:  Word2Vec model for semantic similarity.
    :param sim_threshold: Similarity threshold (e.g., 0.85) to consider two ingredients a match.
    :return: Coverage score (fraction of recipe ingredients matched by query ingredients).
    """
    print("------------------------------------")
    print("Compute coverage")
    print("Query set: ", query_set, " - type: ", type(query_set))
    print("Recipe set: ", recipe_set, " - type: ", type(recipe_set))
    print("------------------------------------")
    if not recipe_set:
        return 0.0
    matched = 0
    for recipe_ing in recipe_set: 
        for query_ing in query_set:
            # Check if both ingredients are in the Word2Vec vocabulary
            if query_ing in w2v_model.wv and recipe_ing in w2v_model.wv:
                similarity = w2v_model.wv.similarity(query_ing, recipe_ing)
                if similarity >= sim_threshold:
                    print("Matched: ", recipe_ing, " - ", query_ing, " - similarity: ", similarity)
                    matched += 1
                    break  
    return matched / len(recipe_set)

def compute_content_based_final_score(similarity_score, coverage):
    # User Harmonic Mean formula  
    if similarity_score is None or coverage is None:
        return 0.0
    denominator = similarity_score + coverage
    if denominator == 0 or np.isnan(denominator):
        return 0.0
    return 2 * (similarity_score * coverage) / denominator
