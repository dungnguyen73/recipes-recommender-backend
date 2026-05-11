from typing import Tuple
from zenml import step
import pandas as pd
from sklearn.preprocessing import LabelEncoder

@step
def preprocess_interaction_data(df: pd.DataFrame) -> Tuple[pd.DataFrame, int, int]:
    user_encoder = LabelEncoder()
    item_encoder = LabelEncoder()

    df["user"] = user_encoder.fit_transform(df["userId"])
    df["item"] = item_encoder.fit_transform(df["RecipeId"])
    df["label"] = df["rating"].apply(lambda r: float(r) / 5.0)

    n_users = df["user"].nunique()
    n_items = df["item"].nunique()

    return df[["user", "item", "label"]], n_users, n_items
