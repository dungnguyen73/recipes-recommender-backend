import traceback
from fastapi import FastAPI, Body
from pydantic import BaseModel


from app.recommender import RecipeRecommender
from app.model_loader import load_tfidf, load_w2v_model, load_content_features, load_faiss_index, load_ncf_model

from pipeline.content_based.pipeline import content_based_pipeline
from pipeline.ncf.pipeline import ncf_pipeline

app = FastAPI()

# Load data and models
content_features = load_content_features()
tfidf = load_tfidf()
w2v_model = load_w2v_model()
index = load_faiss_index()
ncf_model = load_ncf_model()


# Instantiate the recommender
recommender = RecipeRecommender(
                                content_features, 
                                ncf_model, 
                                index, 
                                tfidf, 
                                w2v_model,
                                )

# --- Request Models ---

class HybridRecommendationRequest(BaseModel):
    user_id: int = None  # Optional user ID
    query: str          # Query string of ingredients
    k: int = 10         # Number of recommendations to return
    num_candidates: int = 10
    coverage_threshold: int = 0.8
    sim_threshold: int = 0.85


# --- Route ---

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/recommend/hybrid")
async def recommend_hybrid(request: HybridRecommendationRequest = Body(...)):
    print("Request: ", request)
    results, metadata = recommender.hybrid_recommend(
        user_id=request.user_id,
        query=request.query,
        k=request.k,
        num_candidates=request.num_candidates,
        # coverage_threshold=request.coverage_threshold,
        sim_threshold=request.sim_threshold
     
    )

    response = {
        "total_elements": len(results),
        "metadata": metadata,
        "data": results
    }
    return response


@app.post("/model/content-based/run-pipeline")
async def run_content_based_pipeline():
    try:
        content_based_pipeline()
        return {"status": "success", "message": "Pipeline run successfully!"}
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "trace": traceback.format_exc()
        }
    
@app.post("/model/ncf/run-pipeline")
async def run_ncf_pipeline():
    try:
        ncf_pipeline()
        return {"status": "success", "message": "Collaborative Filtering Pipeline run successfully!"}
    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "trace": traceback.format_exc()
        }