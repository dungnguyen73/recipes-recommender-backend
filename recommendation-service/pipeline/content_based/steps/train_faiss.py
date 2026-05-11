from zenml import step
import faiss
import numpy as np

@step(enable_cache=True)
def build_faiss_index(
    combined_features: np.ndarray,
    recipe_ids: np.ndarray  # shape: (N,) and dtype: int64
) -> faiss.Index:
    # Normalize features for cosine similarity
    faiss.normalize_L2(combined_features)

    # Create index with inner product similarity
    base_index = faiss.IndexFlatIP(combined_features.shape[1])
    index = faiss.IndexIDMap(base_index)

    # Ensure IDs are int64 and 1D
    ids = recipe_ids.astype(np.int64).reshape(-1)

    # Add features with IDs
    index.add_with_ids(combined_features, ids)
    return index