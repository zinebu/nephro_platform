from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.patientdb import get_db, Historique, Patient

router = APIRouter()

@router.get("/historique/{email}")
def get_historique(email: str, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter_by(email=email).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient non trouvé")

    historique = db.query(Historique).filter_by(patient_id=patient.id).order_by(Historique.date.desc()).all()
    return [{"date": h.date, "tgf": h.tgf, "diagnostic": h.diagnostic, "message": h.message, "recommandation": h.recommandation} for h in historique]
@router.get("/historique/analyse/{email}")
def analyse_predictions(email: str, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter_by(email=email).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient non trouvé")

    historique = db.query(Historique).filter_by(patient_id=patient.id).all()

    result = {
        "diagnostics": {},
        "recommandations": {},
        "tgf_time": []
    }

    for h in historique:
        # Comptage des diagnostics
        result["diagnostics"][h.diagnostic] = result["diagnostics"].get(h.diagnostic, 0) + 1
        # Comptage des recommandations
        result["recommandations"][h.recommandation] = result["recommandations"].get(h.recommandation, 0) + 1
        # Données TGF dans le temps
        result["tgf_time"].append({
            "date": h.date.isoformat(),
            "tgf": h.tgf
        })

    return result
