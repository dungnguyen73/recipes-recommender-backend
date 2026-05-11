
import os
from typing import List, Dict, Optional
from dotenv import load_dotenv
from app.utils.db_connect import DBConnectFactory

load_dotenv()

MONGO_URI = os.getenv("DB_CONNECT_STRING")
RECIPE_DATABASE_NAME = os.getenv("RECIPE_DATABASE_NAME")
RECIPE_COLLECTION_NAME = os.getenv("RECIPE_COLLECTION_NAME")

if not MONGO_URI:
    raise ValueError("Environment variable DB_CONNECT_STRING is not set or empty.")
if not RECIPE_DATABASE_NAME:
    raise ValueError("Environment variable RECIPE_DATABASE_NAME is not set or empty.")
if not RECIPE_COLLECTION_NAME:
    raise ValueError("Environment variable RECIPE_COLLECTION_NAME is not set or empty.")

db_factory = DBConnectFactory(
    uri=MONGO_URI,
    database_name=RECIPE_DATABASE_NAME,
    collection_name=RECIPE_COLLECTION_NAME,
)
collection = db_factory.connect()


def get_recipes_by_ids(recipe_ids: List[int]) -> List[Dict]:
  
    query = {"RecipeId": {"$in": recipe_ids}}
    results = list(collection.find(query, {"_id": 0}))
    return results


def get_recipe_by_id(recipe_id: int) -> Optional[Dict]:
 
    result = collection.find_one({"RecipeId": recipe_id}, {"_id": 0})
    return result
