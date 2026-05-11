import os
from typing import List, Dict
from dotenv import load_dotenv
from app.utils.db_connect import DBConnectFactory

load_dotenv()

MONGO_URI = os.getenv("DB_CONNECT_STRING")
USER_INTERACTION_DATABASE_NAME = os.getenv("USER_INTERACTION_DATABASE_NAME")
USER_INTERACTION_COLLECTION_NAME = os.getenv("USER_INTERACTION_COLLECTION_NAME")

db_factory = DBConnectFactory(
    uri=MONGO_URI,
    database_name=USER_INTERACTION_DATABASE_NAME,
    collection_name=USER_INTERACTION_COLLECTION_NAME,
)
collection = db_factory.connect()


def get_user_interaction_by_user_id(user_id: str) -> List[Dict]:
    return list(collection.find({"userId": user_id}, {"_id": 0}))


def has_user_history(user_id: str) -> bool:
    return collection.count_documents({"userId": user_id}) > 0


def count_user_interactions(user_id: str) -> int:
    return collection.count_documents({"userId": user_id})
