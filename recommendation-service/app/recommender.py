import numpy as np
import faiss
import torch
from scipy.sparse import hstack
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from rapidfuzz import fuzz

from app.utils.preprocess import clean_ingredient_string, preprocess_ingredients, parse_ingredient_set
from app.utils.recipes_handler import get_recipes_by_ids
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

# def compute_content_based_final_score(similarity_score, coverage):
#     # User Harmonic Mean formula  
#     if similarity_score is None or coverage is None:
#         return 0.0
#     denominator = similarity_score + coverage
#     if denominator == 0 or np.isnan(denominator):
#         return 0.0
#     return 2 * (similarity_score * coverage) / denominator


class RecipeRecommender:
    def __init__(self, content_features, model, index, tfidf, w2v_model):
        """
        :param content_features: NumPy array or similar with precomputed content features.
        :param model: A PyTorch model for neural collaborative filtering (NCF).
        :param index: FAISS index for content-based search.
        :param tfidf: A fitted TfidfVectorizer.
        :param w2v_model: A trained gensim Word2Vec model.
        :param user_history: A dictionary mapping user IDs to their history of recipe interactions.
        """
        self.content_features = content_features
        self.model = model
        self.index = index
        self.tfidf = tfidf
        self.w2v_model = w2v_model

    def content_based_search(self, query, k=5):
        """
        Given a query string of ingredients, returns indices and distances of the top-k similar recipes.
        
        :return: A tuple of two NumPy arrays:
                 - indices: Array of shape (k,) containing the indices of the top-k similar recipes.
                 - distances: Array of shape (k,) containing the corresponding distances.
        """
        # Process query text
        if not isinstance(query, str) or not query.strip():
            raise ValueError("Query must be a non-empty string.")
        processed = (query)
        print("Processed query: ", processed)
        # Generate TF-IDF vector (sparse)
        tfidf_vec = self.tfidf.transform([processed])
        # Generate Word2Vec vector
        w2v_vecs = [
            self.w2v_model.wv[word] 
            for word in processed.split() 
            if word in self.w2v_model.wv
        ]
        # Use the mean of word vectors; if none, use a zero vector (with proper dimensionality)
        w2v_vec = np.mean(w2v_vecs, axis=0) if w2v_vecs else np.zeros(self.w2v_model.vector_size)
        
        # Combine TF-IDF and Word2Vec features using hstack.
        query_features = hstack([tfidf_vec, w2v_vec.reshape(1, -1)])
        # Convert the sparse matrix to a dense NumPy array
        query_features = query_features.toarray().astype('float32')

        # Reshape to ensure it has the shape (1, dimension)
        query_features = query_features.reshape(1, -1)
        
        # Normalize a copy of the query vector for cosine similarity search to avoid side effects.
        normalized_query_features = query_features.copy()
        faiss.normalize_L2(normalized_query_features)
        distances, indices = self.index.search(query_features, k)
        print("k: ", k)
        return indices[0], distances[0]
    
    def hybrid_recommend(self, 
                     user_id=None, 
                     query=None, 
                     k=10, 
                     num_candidates=10, 
                     coverage_threshold=0.8, 
                     sim_threshold=0.7):
        candidate_indices, candidate_distances = self.content_based_search(query = query, k = num_candidates)

        print("Candidate indices: ", candidate_indices)
        print("Candidate distances: ", candidate_distances)
        query_set = query.split(",")
        print("Query set: ",query_set)
        candidate_recipes = get_recipes_by_ids([int(idx) for idx in candidate_indices])
        print("candidate recipes len : ", len(candidate_recipes))
        idx_to_recipe = {int(recipe['RecipeId']): recipe for recipe in candidate_recipes if recipe is not None}
        candidate_scores = []
        coverages = {}

        for i, idx in enumerate(candidate_indices):
            print("i: ", i," - idx: ", idx)
            recipe = idx_to_recipe.get(int(idx))
            if recipe is None:
                continue
            recipe_set = parse_ingredient_set(clean_ingredient_string(recipe.get("ingredients", "")))
            # print()
            similarity_score = float(candidate_distances[i])
            coverage = float(compute_coverage_fuzzy(query_set, recipe_set))
            # final_score = float(compute_content_based_final_score(similarity_score, coverage))

            tokens = list(recipe_set) 
            fit_score = compute_fit_score(tokens, self.w2v_model, sim_threshold)

            recipe["fit_score"] = fit_score
            recipe["similarity_score"] = similarity_score
            recipe["coverage_score"] = coverage
            # recipe["final_content_based_score"] = final_score
        
            candidate_scores.append((int(idx), similarity_score))
            coverages[int(idx)] = coverage

        
        if user_id is None or not has_user_history(user_id):
            # === Cold-start user ===
            #distance retuned by FAISS is L2 normalization, the smaller the better
            filtered_candidates = [x for x in candidate_recipes if 'similarity_score' in x]
            sorted_candidates = sorted(filtered_candidates, key=lambda x: x['similarity_score'], reverse= True)
            top_candidates = sorted_candidates[:k]
            results = top_candidates
        else:
            # === Known user: apply NCF hybrid ===
            device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
            user_tensor = torch.LongTensor([user_id] * len(candidate_scores)).to(device)
            item_tensor = torch.LongTensor([idx for idx, _ in candidate_scores]).to(device)

            with torch.no_grad():
                ncf_scores = self.model(user_tensor, item_tensor).cpu().numpy().flatten()

            n = count_user_interactions(user_id)

            weight = 1 / (1 + BETA * n) if n > 0 else 1.0

            hybrid_scores = []
            for i, (idx, content_score) in enumerate(candidate_scores):
                hybrid_score = weight * content_score + (1 - weight) * ncf_scores[i]
                hybrid_scores.append((idx, hybrid_score))

            sorted_hybrid = sorted(hybrid_scores, key=lambda x: x[1], reverse=True)
            top_candidates = sorted_hybrid[:k]
            results = [idx_to_recipe[idx] for idx, _ in top_candidates]
            for i, recipe in enumerate(results):
                recipe['hybrid_score'] = top_candidates[i][1]

        # === Evaluation Metrics ===
        top_indices = [int(recipe['RecipeId']) for recipe in results]
        top_coverages = [coverages.get(idx, 0) for idx in top_indices]

        precision_at_k = sum(1 for cov in top_coverages if cov >= coverage_threshold) / k if k else 0.0
        avg_coverage = np.mean(top_coverages) if top_coverages else 0.0

        # === Ingredient Utilization ===
        used_ingredients = set()
        for idx in top_indices:
            recipe = idx_to_recipe.get(idx)
            if not recipe:
                continue
            recipe_set = parse_ingredient_set(recipe.get("ingredients", ""))
            for recipe_ing in recipe_set:
                for query_ing in query_set:
                    if query_ing in self.w2v_model.wv and recipe_ing in self.w2v_model.wv:
                        used_ingredients.add(query_ing)
                        break

        ingredient_utilization = len(used_ingredients) / len(query_set) if query_set else 0

        metadata = {
            "precision@k": precision_at_k,
            "avg_coverage": avg_coverage,
            "ingredient_utilization": ingredient_utilization
        }

        return results, metadata
