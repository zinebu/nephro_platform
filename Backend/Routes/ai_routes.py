from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any
from datetime import date
import numpy as np
from sqlalchemy.orm import Session
from models.ai import predict_risk, InputData, calculer_tgf  # Assure-toi du bon chemin
from models.patientdb import Patient, get_db
from models.patientdb import Historique

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
def predict_with_tgf(body: dict, db: Session = Depends(get_db)):
    email = body.get("email")
    analyses = body.get("analyses", {})

    patient = db.query(Patient).filter_by(email=email).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient non trouvé")

    # Calcul de l'âge
    naissance = patient.date_naissance
    today = date.today()
    age = today.year - naissance.year - ((today.month, today.day) < (naissance.month, naissance.day))

    sexe = "H" if patient.sexe.lower().startswith("h") else "F"
    africain = patient.africain

    input_data = dict(analyses)
    input_data["age"] = age
    input_data["sexe"] = sexe
    input_data["africain"] = africain

    tgf = calculer_tgf(input_data["sc"], age, sexe, africain)
    diagnostics = predict_risk(input_data)

    # Récupérer le diagnostic principal
    diagnostic = diagnostics[0]["diagnostic"]
    message = diagnostics[0]["message"]
    recommandation = diagnostics[0]["recommandation"]

    # 👉 Ajouter dans la table historique
    historique = Historique(
        patient_id=patient.id,
        tgf=tgf,
        diagnostic=diagnostic,
        message=message,
        recommandation=recommandation
    )
    db.add(historique)
    db.commit()

    return {
        "tgf": tgf,
        "diagnostics": diagnostics
    }