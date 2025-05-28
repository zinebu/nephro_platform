from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Any
import numpy as np
import pickle

app = FastAPI()

# ✅ Charger le modèle et les objets utiles
with open("model.pkl", "rb") as f:
    data = pickle.load(f)

model = data["model"]
scaler = data["scaler"]
imputer = data["imputer"]
columns = data["columns"]
label_map = data["label_map"]

# ✅ Dictionnaire des explications par diagnostic
explications = {
    "Aucun signe de maladie": {
        'required_analyses': columns,
        'message': 'Les analyses sont normales, aucun signe de maladie détecté.',
        'recommandation': "Continuez à faire des contrôles régulièrement."
    },
    "Glomérulonéphrite": {
        'required_analyses': ['age', 'al', 'rbc', 'sc', 'bu', 'pc', 'pcc', 'htn'],
        'message': "Vos analyses montrent une inflammation des reins (sang et protéines dans vos urines). Cela nécessite des examens complémentaires.",
        'recommandation': "Consultez un néphrologue pour un traitement."
    },
    "Insuffisance rénale aiguë": {
        'required_analyses': ['age', 'sc', 'bu', 'pot', 'htn',' pe'],
        'message': "ATTENTION : Vos reins fonctionnent mal brutalement (taux de toxines très élevés). C’est une situation grave.",
        'recommandation': "Allez immédiatement aux urgences."
    },
    "Maladie rénale chronique": {
        'required_analyses': ['age', 'bu', 'al', 'sg', 'hemo', 'pot', 'htn', 'bgr'],
        'message': "Vos reins perdent progressivement leur fonction. C’est souvent silencieux au début.",
        'recommandation': "Un suivi médical est nécessaire à long terme."
    },
    "Néphropathie diabétique": {
        'required_analyses': ['age', 'al', 'sc', 'bgr', 'htn'],
        'message': "Votre diabète a commencé à abîmer vos reins (protéines dans les urines).",
        'recommandation': "Consultez votre diabétologue et néphrologue"
    },
    "Néphropathie hypertensive": {
        'required_analyses': ['age', 'al', 'bu', 'sc', 'htn', 'pot', 'sod'],
        'message': "Votre hypertension artérielle a endommagé vos reins.",
        'recommandation': "Contrôlez votre tension artérielle."
    },
    "Syndrome néphrotique": {
        'required_analyses': ['age', 'al', 'sg', 'hemo', 'pcv', 'sc', 'pot', 'dm', 'pe'],
        'message': "Vos reins laissent fuir beaucoup de protéines (risque de gonflements et fatigue intense).",
        'recommandation': "Consultez rapidement un spécialiste."
    }
}

# ✅ Valeurs neutres par défaut
neutral_values = {
    "age": 35, "bp": 120, "sg": 1.020, "al": 0, "su": 0,
    "bgr": 95, "bu": 15, "sc": 0.9, "sod": 140, "pot": 4.3,
    "hemo": 14.5, "pcv": 44, "wc": 8000, "rc": 4.8,
    "htn": 0, "dm": 0, "cad": 0, "appet": 0, "pe": 0, "ane": 0,
    "rbc": 0, "pc": 0, "pcc": 0, "ba": 0
}

# ✅ Codage binaire pour les valeurs textuelles
ENCODING = {
    "normal": 0, "abnormal": 1,
    "present": 1, "notpresent": 0,
    "yes": 1, "no": 0,
    "good": 0, "poor": 1
}

# ✅ Format d'entrée
class PatientInput(BaseModel):
    data: Dict[str, Any]

# ✅ Prétraitement des données
def preprocess_input(input_data: Dict[str, Any]) -> List[float]:
    values = []
    for col in columns:
        raw = input_data.get(col, neutral_values.get(col, 0))
        if isinstance(raw, str):
            raw = ENCODING.get(raw.lower(), np.nan)
        try:
            val = float(raw)
        except Exception:
            val = neutral_values.get(col, 0)
        if np.isnan(val):
            val = neutral_values.get(col, 0)
        values.append(val)
    return values

# ✅ Fonction principale de prédiction
def predict_risk(input_data: Dict[str, Any], threshold=0.3):
    X = preprocess_input(input_data)
    X_scaled = scaler.transform([X])
    proba = model.predict_proba(X_scaled)[0]

    diagnostics = []
    for i, p in enumerate(proba):
        if p >= threshold:
            name = label_map.get(i, "Inconnu")
            diagnostics.append({
                "diagnostic": name,
                "probabilite": round(p, 3),
                "message": explications.get(name, {}).get("message", "Pas d'explication disponible."),
                "recommandation": explications.get(name, {}).get("recommandation", "")
            })

    # Si aucune maladie au-dessus du seuil, renvoyer la plus probable
    if not diagnostics:
        idx_max = np.argmax(proba)
        name = label_map.get(idx_max, "Inconnu")
        diagnostics.append({
            "diagnostic": name,
            "probabilite": round(proba[idx_max], 3),
            "message": explications.get(name, {}).get("message", "Pas d'explication disponible."),
            "recommandation": explications.get(name, {}).get("recommandation", "")
        })

    return diagnostics