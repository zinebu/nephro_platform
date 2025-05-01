import os
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from ai import predict_risk

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
    print("✅ Reçu :", input.data)
    return predict_risk(input.data)

# Pour exécuter directement avec `python app.py`
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)
