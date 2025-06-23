# app.py
from flask import Blueprint
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from Routes.ai_routes import  router_predict_risk, router_prédire
from Routes.assistant_routes import assistant_router
from Routes.Auth_routes import register_router
from Routes.login_routes import login_router



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
app.include_router(register_router)
app.include_router(login_router)

