from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict, Any
from fastapi.middleware.cors import CORSMiddleware
import traceback

app = FastAPI()

# Middleware pour autoriser les appels depuis React (port 3000, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# Modèle pour /predict
class PatientInput(BaseModel):
    data: Dict[str, Any]

# Modèle pour /assistant
class AssistantInput(BaseModel):
    symptoms: List[str]

# Base de données de symptômes
SYMPTOMS_ANALYSES = {
    "Glomérulonéphrite": {
        "symptoms": [
            "Urine mousseuse", "Gonflement des chevilles", "Fatigue", "Hypertension artérielle",
            "Douleurs dans le bas du dos", "Urines foncées ou rouges", "Perte d'appétit",
            "Nausées et vomissements"
        ],
        "analyses": ["rbc", "pcc", "sg"]
    },
    "Insuffisance rénale aiguë": {
        "symptoms": [
            "Réduction de la quantité d'urine", "Rétention de liquides", "Essoufflement",
            "Confusion", "Nausées et vomissements", "Fatigue intense", "Pression artérielle élevée",
            "Douleurs dans le bas du dos"
        ],
        "analyses": ["sc", "bu", "pot", "bp"]
    },
    "Maladie rénale chronique": {
        "symptoms": [
            "Fatigue excessive", "Gonflement des pieds", "Urine mousseuse", "Hypertension artérielle",
            "Perte d'appétit", "Nausées et vomissements", "Anémie", "Démangeaisons persistantes",
            "Douleurs dans le bas du dos"
        ],
        "analyses": ["bu", "sc", "bgr", "sod", "hemo"]
    }
}

@app.post("/assistant")
def assistant(input: AssistantInput):
    try:
        symptoms = input.symptoms
        if not symptoms:
            return {"message": "Aucun symptôme fourni."}

        possible_diseases = []
        for disease, details in SYMPTOMS_ANALYSES.items():
            matching = list(set(symptoms) & set(details["symptoms"]))
            if matching:
                missing_analyses = details["analyses"]
                possible_diseases.append({
                    "disease": disease,
                    "matching_symptoms": matching,
                    "required_analyses": missing_analyses
                })

        if possible_diseases:
            return {
                "message": f"{len(possible_diseases)} maladie(s) trouvée(s) basée(s) sur vos symptômes.",
                "possible_diseases": possible_diseases
            }
        else:
            return {
                "message": "Aucune maladie trouvée. Essayez d'ajouter plus de symptômes."
            }

    except Exception as e:
        traceback.print_exc()
        return {"error": str(e)}

@app.post("/predict")
def predict(input: PatientInput):
    print("✅ Données reçues :", input.data)
    try:
        # Remplace ceci par ton vrai modèle ML
        return {"proba": 0.87, "prediction": "Glomérulonéphrite"}
    except Exception as e:
        traceback.print_exc()
        return {"proba": None, "error": str(e)}
