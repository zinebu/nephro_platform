from sqlalchemy import create_engine, Column, Integer, String, Date, Boolean, ForeignKey, DateTime, Float
from sqlalchemy.orm import declarative_base, sessionmaker
from datetime import datetime

DATABASE_URL = "postgresql://postgres:Sql22092002@localhost:5432/patientdb"

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Patient(Base):
    __tablename__ = "patients"
    id = Column(Integer, primary_key=True, index=True)
    nom = Column(String(80), nullable=False)
    prenom = Column(String(80), nullable=False)
    date_naissance = Column(Date, nullable=False)
    africain = Column(Boolean, nullable=False)
    sexe = Column(String(20), nullable=False)
    email = Column(String(120), unique=True, nullable=False)
    password = Column(String(128), nullable=False)

class Historique(Base):
    __tablename__ = "historique"
    id = Column(Integer, primary_key=True, index=True)
    patient_id = Column(Integer, ForeignKey("patients.id"))
    date = Column(DateTime, default=datetime.utcnow)
    tgf = Column(Float)
    diagnostic = Column(String(200))
    message = Column(String(300))
    recommandation = Column(String(300))

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Création des tables (patients + historique)
if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    print("Table créée avec succès !")
