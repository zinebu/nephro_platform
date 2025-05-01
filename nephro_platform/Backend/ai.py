# backend/ai.py
import pickle
import numpy as np

# Charger le modèle et objets
with open("model.pkl", "rb") as f:
    obj = pickle.load(f)

model = obj["model"]
scaler = obj["scaler"]
encoders = obj["encoders"]
columns = obj["columns"]
imputer = obj["imputer"]

def predict_risk(patient_dict):
    print("\n🎯 Données patient reçues :")
    for k, v in patient_dict.items():
        print(f"{k}: {v}")

    x_input = []
    for col in columns:
        val = patient_dict.get(col, np.nan)
        if col in encoders:
            le = encoders[col]
            if isinstance(val, str) and val in le.classes_:
                val = le.transform([val])[0]
            elif isinstance(val, str):
                val = np.nan
        x_input.append(val)

    x_array = np.array(x_input).reshape(1, -1)
    x_imputed = imputer.transform(x_array)
    x_scaled = scaler.transform(x_imputed)

    proba_ckd = model.predict_proba(x_scaled)[0][1]
    pourcentage = round(proba_ckd * 100, 2)

    nb_valides = sum(1 for v in patient_dict.values() if v not in ["", 0, None])
    if nb_valides < 3:
        diagnostic = f"⚠️ Résultat très approximatif (seulement {nb_valides} analyse(s)). Probabilité : {pourcentage}%"
    else:
        diagnostic = f"Probabilité de maladie rénale : {pourcentage}%"

    return {
        "diagnostic": diagnostic,
        "proba": pourcentage
    }
