import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

data = pd.read_csv("final_environment_dataset.csv")

data["risk"] = (
    (data["humidity"] > 80) &
    (data["wind_speed"] > 10)
).astype(int)

X = data.drop("risk", axis=1)

# keep only numeric columns
X = X.select_dtypes(include=["number"])

y = data["risk"]

model = RandomForestClassifier()

model.fit(X, y)

joblib.dump(model, "disaster_model.pkl")

print("Model trained successfully")