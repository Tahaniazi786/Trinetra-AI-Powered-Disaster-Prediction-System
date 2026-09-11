import pandas as pd

weather = pd.read_csv("../datasets/weather_data/weather_data.csv")
fire = pd.read_csv("../datasets/fire_data/fire_data.csv")
earthquake = pd.read_csv("../datasets/earthquake_data/earthquake_data.csv")
disaster = pd.read_csv("../datasets/humanitarian_data/disaster_data.csv")

rainfall = pd.read_parquet("../datasets/rainfall_data/rainfall_dataset.parquet")

dataset = pd.concat([weather, fire, earthquake, disaster, rainfall], ignore_index=True)

dataset.to_csv("../datasets/final_environment_dataset.csv", index=False)

print("Datasets merged successfully!")