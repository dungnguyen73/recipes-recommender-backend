import re

import numpy as np
from scipy.sparse import hstack
from gensim.models import Word2Vec
from sklearn.feature_extraction.text import TfidfVectorizer
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

COVERAGE_WEIGHT = 70
def preprocess_ingredients(text):
    text = re.sub(r'[^a-zA-Z\s]', '', text.lower())

    # Tokenize and lemmatize
    tokens = word_tokenize(text)
    return ' '.join([lemmatizer.lemmatize(token)
                for token in tokens if token not in stop_words])

def parse_ingredient_set(text):
    """
    Parse a comma-separated ingredient string into a set of normalized ingredients.
    For example: "grated cucumber, semolina flour, grated coconut" 
    -> {"grated cucumber", "semolina flour", "grated coconut"}
    """
    return set(item.strip().lower() for item in text.split(",") if item.strip())

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