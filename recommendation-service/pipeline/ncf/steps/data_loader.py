from dotenv import load_dotenv
from zenml import step
from pymongo import MongoClient
import pandas as pd
import os

load_dotenv()

@step
def load_interaction_data() -> pd.DataFrame:
    
    client = MongoClient(os.getenv("DB_CONNECT_STRING"))
    db = client[os.getenv("USER_INTERACTION_DATABASE_NAME")]
    collection = db[os.getenv("USER_INTERACTION_COLLECTION_NAME")]
    data = list(collection.find({}, {"_id": 0}))
    df = pd.DataFrame(data)
    print("Loaded interactions data sample: \n", df.head(1))
    return df
