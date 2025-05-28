# app.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from Routes.ai_routes import prediction_router
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
app.include_router(prediction_router)
app.include_router(assistant_router)
