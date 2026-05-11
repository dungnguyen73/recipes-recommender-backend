from zenml import step
import torch
import os

@step
def save_ncf(model: torch.nn.Module):
    model_version = os.getenv("SAVED_PIPELINE_BUILD_MODEL_FOLDER")
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../..'))
    save_dir = os.path.join(root_dir, 'models',model_version )
    print("save dir: ", save_dir)

    os.makedirs(save_dir, exist_ok=True)

    torch.save(model.state_dict(), os.path.join(save_dir,"ncf_recipe_recommender.pth"))
    print("NCF Model saved to models/", model_version)
