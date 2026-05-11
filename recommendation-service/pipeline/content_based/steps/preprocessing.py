from zenml import step
import pandas as pd
import spacy

nlp = spacy.load("en_core_web_sm")

UNITS = {
    "cup", "cups", "tbsp", "tablespoon", "tablespoons", "tsp", "teaspoon", "teaspoons",
    "g", "gram", "grams", "kg", "kilogram", "ml", "milliliter", "l", "liter", "oz", "ounce", "ounces",
    "lb", "pound", "pounds", "pinch", "dash", "inch", "baby"
}

COMMON_SECONDARY_INGREDIENTS = set([
    "salt", "pepper", "water", "oil", "sugar", "vinegar", "butter",
    "baking powder", "baking soda", "yeast",
    "spices", "seasoning", "flour", "vanilla", "milk", "cream", "extract"
])

def clean_ingredient_string(ingredient_str: str) -> str:
    """
    Clean a single ingredient string using SpaCy:
    - remove quantities & units
    - remove secondary ingredients
    - lemmatize
    - return simplified ingredient text
    """
    if not isinstance(ingredient_str, str) or not ingredient_str.strip():
        return ""
    
    doc = nlp(ingredient_str.lower())
    tokens = []

    for token in doc:
        # Skip stopwords, punctuation, and units
        if (
            token.is_stop
            or token.is_punct
            or token.text.isnumeric()
            or token.text in UNITS
            or token.pos_ not in {"NOUN", "PROPN"}
        ):
            continue

        # Lemmatize and remove common secondary ingredients
        lemma = token.lemma_
        if lemma and lemma not in COMMON_SECONDARY_INGREDIENTS and lemma.isalpha():
            tokens.append(lemma)
    
    tokens = list(dict.fromkeys(tokens))  # for removing duplicate 

    return ", ".join(tokens).strip(", ")



@step(enable_cache=True)
def preprocess_ingredients(df: pd.DataFrame) -> pd.DataFrame:
    df["ingredient_clean"] = df["ingredients"].apply(clean_ingredient_string)
    df = df[df['ingredient_clean'].apply(lambda x: len(x.split(', ')) >= 3)]
    return df
