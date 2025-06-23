from .patientdb import Patient, get_db

def login_patient(email, password):
    db = next(get_db())
    user = db.query(Patient).filter_by(email=email).first()
    if not user:
        return False, "Utilisateur non trouvé"
    if user.password != password:
        return False, "Mot de passe incorrect"
    return True, f"Bienvenue {user.prenom} !"
