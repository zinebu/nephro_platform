import pickle
import numpy as np

# Chargement du modèle et des outils
with open("model.pkl", "rb") as f:
    data = pickle.load(f)

model = data["model"]
scaler = data["scaler"]
imputer = data["imputer"]
columns = data["columns"]
label_map = data["label_map"]

# ✅ Encodage manuel des valeurs textuelles
ENCODING = {
    "normal": 0,
    "abnormal": 1,
    "present": 1,
    "notpresent": 0,
    "yes": 1,
    "no": 0,
    "good": 0,
    "poor": 1
}

# ✅ Valeurs neutres pour analyses manquantes
neutral_values = {
    "age": 35, "bp": 120, "sg": 1.020, "al": 0, "su": 0,
    "bgr": 95, "bu": 15, "sc": 0.9, "sod": 140, "pot": 4.3,
    "hemo": 14.5, "pcv": 44, "wc": 8000, "rc": 4.8,
    "htn": 0, "dm": 0, "cad": 0, "appet": 0, "pe": 0, "ane": 0,
    "rbc": 0, "pc": 0, "pcc": 0, "ba": 0
}

# ✅ Nettoyage & remplissage des valeurs manquantes
def preprocess_input(input_data):
    values = []
    for col in columns:
        raw = input_data.get(col, None)

        if isinstance(raw, str):
            raw = ENCODING.get(raw.strip().lower(), np.nan)

        try:
            val = float(raw)
        except (ValueError, TypeError):
            val = np.nan

        if np.isnan(val):
            val = neutral_values.get(col, 0)

        values.append(val)

    return values

# 🔮 Prédiction + explication
def predict_risk(input_data):
    X = preprocess_input(input_data)
    X_scaled = scaler.transform([X])
    prediction = model.predict(X_scaled)[0]
    diagnostic = label_map.get(prediction, "Inconnu")

    explications = {
        "Maladie rénale chronique": {
            "message": "La maladie rénale chronique est une dégradation progressive de la fonction rénale.",
            "recommandation": "Consultez un néphrologue pour un suivi régulier."
        },
        "Insuffisance rénale aiguë": {
            "message": "Il s'agit d'une détérioration rapide et brutale de la fonction rénale.",
            "recommandation": "🚨 Cas urgent : consultez immédiatement un médecin ou allez aux urgences."
        },
        "Glomérulonéphrite": {
            "message": "Inflammation des glomérules, souvent liée à une infection ou une maladie auto-immune.",
            "recommandation": "Consultez un spécialiste pour traitement anti-inflammatoire."
        },
        "Néphropathie hypertensive": {
            "message": "L'hypertension prolongée endommage les reins.",
            "recommandation": "Contrôlez votre tension avec un médecin."
        },
        "Aucun signe de maladie": {
            "message": "Aucune anomalie détectée dans les analyses fournies.",
            "recommandation": "Continuez vos bilans de contrôle régulièrement."
        }
    }

    return {
        "diagnostic": diagnostic,
        "explication": explications.get(diagnostic, {}).get("message", "Pas d'explication disponible."),
        "recommandation": explications.get(diagnostic, {}).get("recommandation", "")
    }
