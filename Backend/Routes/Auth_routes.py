from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
from models.Auth import register_patient

register_router = APIRouter()

class RegisterRequest(BaseModel):
    nom: str
    prenom: str
    date_naissance: str
    africain: bool
    sexe: str
    email: EmailStr
    password: str

@register_router.post("/register")
def register_user(data: RegisterRequest):
    success, message = register_patient(data.dict())
    if success:
        return {"success": True, "message": message}
    elif message == "Email déjà utilisé":
        raise HTTPException(status_code=400, detail=message)
    else:
        raise HTTPException(status_code=500, detail=message)
