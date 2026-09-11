"""
TRINETRA - Empirical Disaster Prediction Model Training
========================================================
Trained strictly on verified, accredited historical datasets:
- ECMWF Copernicus ERA5 atmospheric reanalysis for Indian historical disasters & normal baselines
- CRED EM-DAT International Disaster Database for verified disaster occurrences
- USGS (United States Geological Survey) ANSS Catalog for verified seismic events

Zero synthetic or heuristic data generation.
Outputs:
  - backend/model.pkl (Binary Risk Classifier: 0=No Risk, 1=Risk)
  - backend/disaster_type_model.pkl (Disaster Classifier: 0=Normal, 1=Flood, 2=Cyclone, 3=Landslide, 4=Earthquake, 5=Drought)
"""

import os
import sys
import joblib
import pandas as pd
import numpy as np

# Ensure clean UTF-8 console output on Windows
if sys.stdout.encoding != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score, confusion_matrix

DATASET_PATH = os.path.join(os.path.dirname(__file__), "verified_disaster_dataset.csv")

DISASTER_TYPES = {
    0: "Normal",
    1: "Flood",
    2: "Cyclone",
    3: "Landslide",
    4: "Earthquake",
    5: "Drought",
}

FEATURE_COLS = ["rainfall", "humidity", "temperature", "pressure", "wind_speed", "magnitude", "time"]

def train_verified_models():
    if not os.path.exists(DATASET_PATH):
        raise FileNotFoundError(f"Verified dataset not found at: {DATASET_PATH}. Run build_genuine_dataset.py first.")

    print("=" * 65)
    print("LOADING VERIFIED EMPIRICAL DATASET")
    print("=" * 65)
    df = pd.read_csv(DATASET_PATH)
    print(f"Loaded {len(df)} authentic empirical records.")
    print("\nClass distribution:")
    for type_id, name in DISASTER_TYPES.items():
        count = len(df[df["disaster_type"] == type_id])
        print(f"  [{type_id}] {name:12s}: {count:5d} records")

    # Clean missing values if any
    df = df.dropna(subset=FEATURE_COLS + ["risk", "disaster_type"])

    X = df[FEATURE_COLS]
    y_risk = df["risk"]
    y_disaster = df["disaster_type"]

    # Stratified 80/20 train/test split
    X_train, X_test, y_risk_train, y_risk_test, y_dis_train, y_dis_test = train_test_split(
        X, y_risk, y_disaster, test_size=0.20, random_state=42, stratify=y_disaster
    )

    print(f"\nTraining set: {len(X_train)} samples")
    print(f"Testing set : {len(X_test)} samples")

    # =========================================================
    # 1. RISK BINARY CLASSIFIER (Random Forest)
    # =========================================================
    print("\n" + "=" * 65)
    print("TRAINING RISK BINARY CLASSIFIER (Random Forest)")
    print("=" * 65)

    risk_model = RandomForestClassifier(
        n_estimators=300,
        max_depth=12,
        min_samples_split=4,
        min_samples_leaf=2,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1
    )
    risk_model.fit(X_train, y_risk_train)

    risk_preds = risk_model.predict(X_test)
    risk_acc = accuracy_score(y_risk_test, risk_preds)
    print(f"✅ Risk Model Empirical Accuracy: {risk_acc * 100:.2f}%\n")
    print(classification_report(y_risk_test, risk_preds, target_names=["No Risk", "Disaster Risk"]))

    # =========================================================
    # 2. DISASTER TYPE MULTI-CLASS CLASSIFIER (Gradient Boosting)
    # =========================================================
    print("=" * 65)
    print("TRAINING DISASTER TYPE CLASSIFIER (Gradient Boosting)")
    print("=" * 65)

    disaster_model = GradientBoostingClassifier(
        n_estimators=250,
        max_depth=8,
        learning_rate=0.08,
        min_samples_split=4,
        min_samples_leaf=2,
        random_state=42
    )
    disaster_model.fit(X_train, y_dis_train)

    dis_preds = disaster_model.predict(X_test)
    dis_acc = accuracy_score(y_dis_test, dis_preds)
    print(f"✅ Disaster Type Classifier Empirical Accuracy: {dis_acc * 100:.2f}%\n")
    present_classes = sorted(y_dis_test.unique())
    target_names = [DISASTER_TYPES[i] for i in present_classes]
    print(classification_report(y_dis_test, dis_preds, target_names=target_names))

    # Feature Importances
    print("\nFeature Importances (Risk Model):")
    for feat, imp in sorted(zip(FEATURE_COLS, risk_model.feature_importances_), key=lambda x: -x[1]):
        print(f"  {feat:15s}: {imp * 100:5.2f}%")

    # =========================================================
    # 3. EXPORT VERIFIED MODEL ARTIFACTS
    # =========================================================
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    backend_dir = os.path.join(base_dir, "backend")

    risk_dest = os.path.join(backend_dir, "model.pkl")
    dis_dest = os.path.join(backend_dir, "disaster_type_model.pkl")

    joblib.dump(risk_model, risk_dest)
    joblib.dump(disaster_model, dis_dest)

    # Also keep a local copy in ml/
    joblib.dump(risk_model, os.path.join(os.path.dirname(__file__), "model.pkl"))

    print("\n" + "=" * 65)
    print("VERIFIED MODEL WEIGHTS EXPORTED SUCCESSFULLY")
    print(f"  -> {risk_dest}")
    print(f"  -> {dis_dest}")
    print("=" * 65)

if __name__ == "__main__":
    train_verified_models()