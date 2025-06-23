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
            "Urines foncées ou rouges", "Perte d'appétit", "Nausées"
        ],
        "analyses": ['age', 'al', 'rbc', 'sc', 'bu', 'pc', 'pcc', 'htn']
    },
    "Insuffisance rénale aiguë": {
        "symptoms": [
            "Réduction de la quantité d'urine", "Rétention de liquides", "Essoufflement",
            "Confusion", "Nausées", "Fatigue intense", "Hypertension soudaine", "Douleurs dans le bas du dos"
        ],
        "analyses": ['age', 'sc', 'bu', 'pot', 'htn', 'pe']
    },
    "Maladie rénale chronique": {
        "symptoms": [
            "Fatigue chronique", "Gonflement des pieds", "Urine mousseuse", "Hypertension artérielle",
            "Perte d'appétit", "Anémie", "Nausées", "Crampes musculaires", "Démangeaisons"
        ],
        "analyses": ['age', 'bu', 'al', 'sg', 'sc', 'hemo', 'pot', 'htn', 'bgr']
    },
    "Néphropathie diabétique": {
        "symptoms": [
            "Urine mousseuse", "Fatigue", "Gonflement des pieds", "Perte de poids",
            "Hypertension", "Besoin fréquent d’uriner"
        ],
        "analyses": ['age', 'al', 'sc', 'bgr', 'htn']
    },
    "Néphropathie hypertensive": {
        "symptoms": [
            "Hypertension persistante", "Gonflement des jambes", "Urine mousseuse", "Fatigue",
            "Vertiges", "Douleurs dans les reins"
        ],
        "analyses": ['age', 'al', 'bu', 'sc', 'htn', 'pot', 'sod']
    },
    "Syndrome néphrotique": {
        "symptoms": [
            "Gonflement important", "Urine très mousseuse", "Fatigue extrême",
            "Prise de poids rapide", "Perte d’appétit", "Infections fréquentes"
        ],
        "analyses": ['age', 'al', 'sg', 'hemo', 'pcv', 'sc', 'pot', 'dm', 'pe']
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
