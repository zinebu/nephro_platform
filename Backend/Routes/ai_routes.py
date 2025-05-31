from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import numpy as np
from models.ai import predict_risk, InputData  # Assure-toi du bon chemin
from models.ai import calculer_tgf

router_predict_risk= APIRouter()
router_prédire = APIRouter()


class PatientInput(BaseModel):
    data: Dict[str, Any]

def convert_numpy_types(obj):
    if isinstance(obj, (np.float32, np.float64)):
        return float(obj)
    if isinstance(obj, dict):
        return {k: convert_numpy_types(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [convert_numpy_types(i) for i in obj]
    return obj



@router_predict_risk.post("/predict_rf_strict")
def predict_rf_strict(input_data: InputData):
    """
    Retourne uniquement les diagnostics proposés par le modèle Random Forest,
    SI ET SEULEMENT SI toutes les analyses requises sont présentes dans la requête.
    """
    results = predict_risk(input_data.data, top_k=3)
    return {
        "diagnostics": results
     }

@router_prédire.post("/predict")
def predict_with_tgf(request: dict):
    patient = request.get("patient", {})
    analyses = request.get("analyses", {})
    age = patient.get("age")
    sexe = patient.get("sexe")
    origine_africaine = patient.get("origine")  # <-- Gère les deux noms !
    creatinine = analyses.get("sc")

    # Vérifier les champs obligatoires
    if creatinine is None or age is None or not sexe or origine_africaine is None:
        return {
            "error": "Merci de fournir l'âge, le sexe, l'origine et la créatinine (sc) pour le calcul du TGF."
        }
    try:
        tgf = calculer_tgf(float(creatinine), int(age), sexe, origine_africaine)
    except Exception as e:
        return {"error": str(e)}

    # Le DIAGNOSTIC doit utiliser STRICTEMENT la même fonction ML !
    diagnostics = predict_risk(analyses)

    return {
        "tgf": tgf,
        "diagnostics": diagnostics
    }
