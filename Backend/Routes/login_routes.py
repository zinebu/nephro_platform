from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from models.connexion import login_patient

login_router = APIRouter()

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

@login_router.post("/login")
def login_user(data: LoginRequest):
    success, message, nom, prenom = login_patient(data.email, data.password)
    if success:
          return {
              "success": True,
              "message": message,
              "nom": nom,
              "prenom": prenom
    }
    else:
      raise HTTPException(status_code=401, detail=message)
