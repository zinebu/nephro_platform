#Backend/app.py
import os
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from ai import predict_risk
import traceback

app = FastAPI(title="Plateforme Médicale de Néphrologie")

# ✅ Autoriser les appels depuis React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou ["http://localhost:3000"] si tu veux restreindre
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📦 Schéma des données envoyées par React
class PatientInput(BaseModel):
    data: dict

# 🔮 Route pour la prédiction
@app.post("/predict")
def predict(input: PatientInput):
    print("✅ Données reçues :", input.data)
    try:
        result = predict_risk(input.data)
        print("🎯 Résultat du modèle :", result)
        return result
    except Exception as e:
   
       traceback.print_exc()  # 🛠️ pour voir l'erreur dans le terminal
       return {"proba": None, "error": str(e)}

