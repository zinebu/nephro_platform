from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict, Any; list
import numpy as np
import joblib
from flask import Flask, request, jsonify
app = Flask(__name__)

app = FastAPI()


# Charger le modèle et le label encoder
model_data = joblib.load("model.pkl")
model = model_data["model"]
label_encoder = model_data["label_encoder"]
columns = model.named_steps['imputer'].feature_names_in_

# Dictionnaire des explications
explications = {
    "Aucun signe de maladie": {
        'required_analyses': columns.tolist(),
        'message': 'Les analyses sont normales, aucun signe de maladie détecté.',
        'recommandation': "Continuez à faire des contrôles régulièrement."
    },
    "Glomérulonéphrite": {
        'required_analyses': ['age', 'al', 'rbc', 'sc', 'bu', 'pc', 'pcc', 'htn'],
        'message': "Vos analyses montrent une inflammation des reins (sang et protéines dans vos urines). Cela nécessite des examens complémentaires.",
        'recommandation': "Consultez un néphrologue pour un traitement."
    },
    "Insuffisance rénale aiguë": {
        'required_analyses': ['age', 'sc', 'bu', 'pot', 'htn','pe'],
        'message': "ATTENTION : Vos reins fonctionnent mal brutalement (taux de toxines très élevés). C'est une situation grave.",
        'recommandation': "Allez immédiatement aux urgences."
    },
    "Maladie rénale chronique": {
        'required_analyses': ['age', 'bu', 'al', 'sg', 'sc', 'hemo', 'pot', 'htn', 'bgr'],
        'message': "Vos reins perdent progressivement leur fonction. C'est souvent silencieux au début.",
        'recommandation': "Un suivi médical est nécessaire à long terme."
    },
    "Néphropathie diabétique": {
        'required_analyses': ['age', 'al', 'sc', 'bgr', 'htn'],
        'message': "Votre diabète a commencé à abîmer vos reins (protéines dans les urines).",
        'recommandation': "Consultez votre diabétologue et néphrologue."
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

neutral_values = {
    "age": 35, "bp": 120, "sg": 1.020, "al": 0, "su": 0,
    "bgr": 95, "bu": 15, "sc": 0.9, "sod": 140, "pot": 4.3,
    "hemo": 14.5, "pcv": 44, "wc": 8000, "rc": 4.8,
    "htn": 0, "dm": 0, "cad": 0, "appet": 0, "pe": 0, "ane": 0,
    "rbc": 0, "pc": 0, "pcc": 0, "ba": 0
}

ENCODING = {
    "normal": 0, "abnormal": 1,
    "present": 1, "notpresent": 0,
    "yes": 1, "no": 0,
    "good": 0, "poor": 1
}


class InputData(BaseModel):
    data: Dict[str, Any]

def preprocess_input(input_data: Dict[str, Any]):
    """Convertit les données patient en tableau compatible modèle."""
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
    return np.array(values).reshape(1, -1)

def missing_analyses(input_data: Dict[str, Any]):
    """Renvoie la liste des analyses non fournies par le patient."""
    return [col for col in columns if col not in input_data]

def is_normal_case(input_data):
    # Compare toutes les clés présentes dans neutral_values
    for k, v in neutral_values.items():
        user_v = input_data.get(k)
        # Gère les strings
        if isinstance(user_v, str):
            user_v = ENCODING.get(user_v.strip().lower(), user_v)
        try:
            user_v = float(user_v)
        except (ValueError, TypeError):
            return False
        if user_v != v:
            return False
    return True


def predict_risk(input_data: dict, top_k=2):
    if len(input_data.keys()) < 5:
        return [{
            "message": " Merci de compléter plus d’analyses médicales afin d’améliorer la précision de la prédiction."
        }]
    X = preprocess_input(input_data)
    proba = model.predict_proba(X)[0]
    indices = proba.argsort()[::-1]
    provided = set(input_data.keys())
    results = []
    count = 0

    # Flag pour détecter si tout est normal
    tout_normal = True

    for idx in indices:
        if count >= top_k:
            break
        diagnostic = label_encoder.inverse_transform([idx])[0]
        explication = explications.get(diagnostic, {})
        required = set(explication.get('required_analyses', []))
        if required.issubset(provided):
            # Vérifier si toutes les valeurs sont normales pour ce diagnostic
            any_abnormal = False
            for col in required:
                val = input_data.get(col)
                if isinstance(val, str):
                    val = ENCODING.get(val.strip().lower(), val)
                try:
                    val = float(val)
                except (ValueError, TypeError):
                    continue
                normal_val = neutral_values.get(col, 0)
                if val != normal_val:
                    any_abnormal = True
                    tout_normal = False
            if any_abnormal:
                results.append({
                    "diagnostic": diagnostic,
                    "message": explication.get('message', ''),
                    "recommandation": explication.get('recommandation', '')
                })
                count += 1

    # Cas où tout est normal : on ne retourne que 'Aucun signe de maladie'
    if tout_normal:
        return [{
            "diagnostic": "Aucun signe de maladie",
            "message": explications["Aucun signe de maladie"].get("message", ""),
            "recommandation": explications["Aucun signe de maladie"].get("recommandation", "")
        }]
    # Juste avant le "return results" :
    for diag in results:
        if diag.get("diagnostic") == "Aucun signe de maladie":
            return [diag]

    return results


# models/TGF.py

def calculer_tgf(creatinine, age, sexe, origine):

    if creatinine is None or age is None or not sexe or origine is None:
        raise ValueError("Créatinine (sc), âge, sexe et origine doivent être fournis.")
    try:
        creatinine = float(creatinine)
        age = float(age)
    except Exception:
        raise ValueError("Créatinine et âge doivent être des valeurs numériques.")
    if creatinine <= 0 or age <= 0:
        raise ValueError("Créatinine et âge doivent être strictement positifs.")

    sexe = str(sexe).strip().upper()
    if sexe not in ("H", "F"):
        raise ValueError("Le sexe doit être 'H' (homme) ou 'F' (femme).")

    facteur_sexe = 0.742 if sexe == 'F' else 1
    facteur_origine = 1.212 if origine else 1

    tgf = (
        175 *
        (creatinine ** -1.154) *
        (age ** -0.203) *
        facteur_sexe *
        facteur_origine
    )
    return round(tgf, 2)

def creatinine_umolL_to_mgdl(creat_umolL):
    """
    Convertit la créatinine de µmol/L en mg/dL
    """
    return float(creat_umolL) / 88.4
@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    print("==== Données reçues depuis le frontend ====")
    print(data)

    # retour temporaire pour tester seulement la réception
    return jsonify({
        "diagnostics": [
            {
                "diagnostic": "Test OK",
                "message": f"{len(data.get('analyses', {}))} analyses reçues",
                "recommandation": "Connexion avec le frontend réussie"
            }
        ]
    })

