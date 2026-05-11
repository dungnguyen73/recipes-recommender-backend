import pandas as pd
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("DB_CONNECT_STRING")
RECIPE_DATABASE_NAME = os.getenv("RECIPE_DATABASE_NAME")
USER_INTERACTION_DATABASE_NAME = os.getenv("USER_INTERACTION_DATABASE_NAME")
RECIPE_COLLECTION_NAME = os.getenv("RECIPE_COLLECTION_NAME")
USER_INTERACTION_COLLECTION_NAME = os.getenv("USER_INTERACTION_COLLECTION_NAME")

class DBConnectFactory:
    def __init__(self, uri, database_name, collection_name):
        self.uri = uri
        self.database_name = database_name
        self.collection_name = collection_name
        self._client = None

    def connect(self):
        if self._client is None:
            self._client = MongoClient(self.uri)
        db = self._client[self.database_name]
        collection = db[self.collection_name]
        return collection

def get_recipes_dataframe():
    db_factory = DBConnectFactory(uri=MONGO_URI, database_name=RECIPE_DATABASE_NAME, collection_name=RECIPE_COLLECTION_NAME)
    recipes_collection = db_factory.connect()
    if recipes_collection.find_one():
        print('Successfully connected to the recipes collection')
        return pd.DataFrame(list(recipes_collection.find({}, {"_id": 0})))
    else:
        print('No recipes found in database, returning empty DataFrame')
        # Adjust the columns to match your recipes dataset schema
        return pd.DataFrame(columns=["id", "title", "ingredient"])


def get_user_interaction_data():
    db_factory = DBConnectFactory(uri=MONGO_URI, database_name=USER_INTERACTION_DATABASE_NAME, collection_name=USER_INTERACTION_COLLECTION_NAME)
    user_interaction_collection = db_factory.connect()
    # If the collection is found and has data, return it; otherwise return an empty DataFrame
    if user_interaction_collection.find_one():
        print('Successfully connected to the user interactions collection.')
        return pd.DataFrame(list(user_interaction_collection.find({}, {"_id": 0})))
    else:
        print('User interactions collection not found or empty. Returning empty DataFrame.')
        return pd.DataFrame(columns=["userId", "recipeId", "rating", "timestamp"])

def build_user_history() -> dict:
    """
    Builds an in-memory dictionary mapping each user_id to a list of their interactions.
    If no interaction data is found, returns an empty dictionary.
    """
    interaction_df = get_user_interaction_data()
    if interaction_df.empty:
        return {}
    
    user_history = {}
    for _, row in interaction_df.iterrows():
        user_id = row["userId"]
        interaction = {
            "recipeId": row["recipeId"],
            "rating": row["rating"],
        }
        if user_id in user_history:
            user_history[user_id].append(interaction)
        else:
            user_history[user_id] = [interaction]
    return user_history