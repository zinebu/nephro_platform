from .patientdb import Patient, get_db

def login_patient(email, password):
    db = next(get_db())
    user = db.query(Patient).filter_by(email=email, password=password).first()
    if user:
        return True, "Connexion réussie", user.nom, user.prenom
    return False, "Identifiants incorrects", None, None
