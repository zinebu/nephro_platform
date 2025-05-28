# assistant/routes.py
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import traceback

assistant_router = APIRouter()

class AssistantInput(BaseModel):
    symptoms: List[str]

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

@assistant_router.post("/assistant")
def assistant(input: AssistantInput):
    try:
        symptoms = input.symptoms
        if not symptoms:
            return {"message": "Aucun symptôme fourni. Veuillez fournir des symptômes."}

        possible_diseases = []
        for disease, info in SYMPTOMS_ANALYSES.items():
            matching = list(set(symptoms) & set(info["symptoms"]))
            if matching:
                possible_diseases.append({
                    "disease": disease,
                    "matching_symptoms": matching,
                    "required_analyses": info["analyses"]
                })

        if possible_diseases:
            return {
                "message": f"{len(possible_diseases)} maladie(s) trouvée(s).",
                "possible_diseases": possible_diseases
            }
        else:
            return {
                "message": "Aucune maladie trouvée. Essayez d'ajouter plus de symptômes."
            }

    except Exception as e:
        traceback.print_exc()
        return {"error": str(e), "message": "Une erreur est survenue lors de la recherche des maladies."}
