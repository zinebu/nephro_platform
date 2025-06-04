# app.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from fastapi.middleware.cors import CORSMiddleware
from Routes.ai_routes import  router_predict_risk, router_prédire
from Routes.assistant_routes import assistant_router

app = FastAPI(title="Plateforme Médicale de Néphrologie")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # À restreindre si nécessaire
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes

app.include_router(assistant_router)
app.include_router(router_predict_risk)
app.include_router(router_prédire)

class User(BaseModel):
    email: str
    password: str


users_db = {}

@app.post("/signup")
def signup(user: User):
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="Utilisateur déjà inscrit.")
    users_db[user.email] = user.password
    return {"message": "Inscription réussie"}

@app.post("/login")
def login(user: User):
    if user.email not in users_db or users_db[user.email] != user.password:
        raise HTTPException(status_code=401, detail="Identifiants incorrects.")
    return {"message": "Connexion réussie"}
