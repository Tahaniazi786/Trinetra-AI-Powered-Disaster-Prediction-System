import pandas as pd

weather = pd.read_csv("../datasets/weather_data/weather_data.csv")
earthquake = pd.read_csv("../datasets/earthquake_data/earthquake_data.csv")
fire = pd.read_csv("../datasets/fire_data/fire_data.csv")

final = pd.concat([weather, earthquake, fire], axis=1)

final.to_csv("final_environment_dataset.csv", index=False)

print("Final dataset created successfully")