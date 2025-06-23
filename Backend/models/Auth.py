from .patientdb import SessionLocal, Patient
from datetime import datetime

def register_patient(data):
    db = SessionLocal()
    try:
        # Vérifie si l'email existe déjà
        if db.query(Patient).filter_by(email=data["email"]).first():
            return False, "Email déjà utilisé"
        patient = Patient(
            nom=data["nom"],
            prenom=data["prenom"],
            date_naissance=datetime.strptime(data["date_naissance"], "%Y-%m-%d").date(),
            africain=data["africain"],
            sexe=data["sexe"],
            email=data["email"],
            password=data["password"]
        )
        db.add(patient)
        db.commit()
        return True, "Inscription réussie"
    except Exception as e:
        print(e)
        db.rollback()
        return False, "Erreur à l'inscription"
    finally:
        db.close()
