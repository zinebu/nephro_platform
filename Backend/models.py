# backend/models.py
from pydantic import BaseModel

class PatientData(BaseModel):
    age: int
    creatinine: float
    eGFR: float
    blood_pressure: float
    diabetes: bool

class PredictionResponse(BaseModel):
    risk: float
    message: str
