from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import psycopg2

router_patient = APIRouter()

# Connexion PostgreSQL
conn = psycopg2.connect(
    dbname="patientdb",
    user="postgres",
    password="Sql22092002",
    host="localhost",
    port="5432"
)

class Patient(BaseModel):
    email: str

@router_patient.post("/patient-info")
def get_patient_info(patient: Patient):
    try:
        print("Email reçu:", patient.email)
        cur = conn.cursor()
        cur.execute("""
            SELECT nom, prenom,
                   EXTRACT(YEAR FROM AGE(current_date, date_naissance))::int AS age,
                   sexe, africain
            FROM patients 
            WHERE email = %s
        """, (patient.email,))
        row = cur.fetchone()
        cur.close()
        if row:
            return {
                "nom": row[0],
                "prenom": row[1],
                "age": row[2],
                "sexe": row[3],
                "origine": "Africaine" if row[4] else "Autre"
            }
        raise HTTPException(status_code=404, detail="Patient non trouvé")
    except Exception as e:
        print("Erreur SQL:", str(e))
        raise HTTPException(status_code=500, detail="Erreur serveur interne")
