from zenml import pipeline
from pipeline.ncf.steps.data_loader import load_interaction_data
from pipeline.ncf.steps.preprocessing import preprocess_interaction_data
from pipeline.ncf.steps.train_model import train_ncf_model
from pipeline.ncf.steps.save_model import save_ncf

@pipeline
def ncf_pipeline():
    raw_df = load_interaction_data()
    processed_df, n_users, n_items = preprocess_interaction_data(raw_df)
    model = train_ncf_model(processed_df, n_users, n_items)
    save_ncf(model)
