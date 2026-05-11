from zenml import step
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import pandas as pd

class NCFDataset(Dataset):
    def __init__(self, df):
        self.users = torch.LongTensor(df["user"].values)
        self.items = torch.LongTensor(df["item"].values)
        self.labels = torch.FloatTensor(df["label"].values)

    def __len__(self):
        return len(self.users)

    def __getitem__(self, idx):
        return self.users[idx], self.items[idx], self.labels[idx]

class NCF(nn.Module):
    def __init__(self, num_users, num_items, embedding_dim=32):
        super(NCF, self).__init__()
        self.embed_user_GMF = nn.Embedding(num_users, embedding_dim)
        self.embed_item_GMF = nn.Embedding(num_items, embedding_dim)
        self.embed_user_MLP = nn.Embedding(num_users, embedding_dim)
        self.embed_item_MLP = nn.Embedding(num_items, embedding_dim)

        self.mlp = nn.Sequential(
            nn.Linear(embedding_dim * 2, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU()
        )

        self.fc = nn.Linear(embedding_dim + 32, 1)

    def forward(self, user, item):
        gmf_user = self.embed_user_GMF(user)
        gmf_item = self.embed_item_GMF(item)
        gmf = gmf_user * gmf_item

        mlp_user = self.embed_user_MLP(user)
        mlp_item = self.embed_item_MLP(item)
        mlp = self.mlp(torch.cat([mlp_user, mlp_item], dim=-1))

        out = torch.cat([gmf, mlp], dim=-1)
        return self.fc(out).squeeze()

@step
def train_ncf_model(df: pd.DataFrame, n_users: int, n_items: int) -> nn.Module:
    device = "cuda" if torch.cuda.is_available() else "cpu"
    dataset = NCFDataset(df)
    dataloader = DataLoader(dataset, batch_size=64, shuffle=True)

    model = NCF(n_users, n_items).to(device)
    loss_fn = nn.BCEWithLogitsLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.001)

    model.train()
    for epoch in range(10):
        total_loss = 0
        for user, item, label in dataloader:
            user, item, label = user.to(device), item.to(device), label.to(device)
            output = model(user, item)
            loss = loss_fn(output, label)
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            total_loss += loss.item()
        print(f"[Epoch {epoch+1}] Loss: {total_loss:.4f}")
    
    return model
