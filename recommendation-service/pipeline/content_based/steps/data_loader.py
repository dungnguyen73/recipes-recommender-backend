from dotenv import load_dotenv
from zenml import step
from typing import Tuple
from pymongo import MongoClient
import pandas as pd
import os

load_dotenv()

@step
def load_recipe_data() -> pd.DataFrame:
    """Load recipe data from MongoDB."""
    db_connect_string = os.getenv("DB_CONNECT_STRING")
    if not db_connect_string:
        print('Environment variable "DB_CONNECT_STRING" is not set: ', os.getenv("DB_CONNECT_STRING"))
        raise ValueError("Environment variable 'DB_CONNECT_STRING' is not set.")
    db_name = os.getenv("RECIPE_DATABASE_NAME")
    if not db_name:
        raise ValueError("Environment variable 'RECIPE_DATABASE_NAME' is not set.")
    client = MongoClient(db_connect_string)
    db = client[db_name]
    recipe_collection_name = os.getenv("RECIPE_COLLECTION_NAME")
    if not recipe_collection_name:
        raise ValueError("Environment variable 'RECIPE_COLLECTION_NAME' is not set.")
    
    collection = db[recipe_collection_name]
    collection = db[os.getenv("RECIPE_COLLECTION_NAME")]
    recipes = list(collection.find({}, {"_id": 0, "RecipeId": 1, "title": 1, "ingredients": 1}))
    df = pd.DataFrame(recipes)

    # Rename to standard `id` to align with model expectations
    df.rename(columns={"RecipeId": "id"}, inplace=True)
    df.dropna(subset=["id", "title", "ingredients"], inplace=True)

    return df