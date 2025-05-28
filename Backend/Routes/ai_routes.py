from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, Any
import numpy as np
import logging
import traceback
from models.ai import predict_risk  # Ton modèle ML

prediction_router = APIRouter()


# 🔮 Prédiction ML
class PatientInput(BaseModel):
    data: Dict[str, Any]

from fastapi import HTTPException

import numpy as np

def convert_numpy_types(obj):
    if isinstance(obj, (np.float32, np.float64)):
        return float(obj)
    if isinstance(obj, dict):
        return {k: convert_numpy_types(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [convert_numpy_types(i) for i in obj]
    return obj

@prediction_router.post("/predict")
def predict(input: PatientInput):
    try:
        result = predict_risk(input.data)
        # Convertit les types numpy en types Python natifs avant retour
        result_clean = convert_numpy_types(result)

        return {
            "message": f"{len(result_clean)} diagnostic(s) détecté(s).",
            "diagnoses": result_clean
        }
    except ValueError as ve:
        import traceback, logging
        logging.error("Erreur de données lors de la prédiction:")
        logging.error(traceback.format_exc())
        raise HTTPException(status_code=400, detail=f"Erreur de données : {str(ve)}")
    except Exception as e:
        import traceback
        print(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

    except Exception as e:
        logging.error("Erreur interne lors de la prédiction:")
        logging.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail="Erreur interne lors de la prédiction.")
