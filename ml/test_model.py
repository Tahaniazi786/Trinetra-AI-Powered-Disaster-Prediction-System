import joblib

model = joblib.load("../backend/model.pkl")

sample = [[220, 30, 90, 9.5, 80, 1005]]

prediction = model.predict(sample)

print("Prediction:", prediction)