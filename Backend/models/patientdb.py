from sqlalchemy import create_engine, Column, Integer, String, Date, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker # type: ignore

DATABASE_URL = "postgresql://postgres:Sql22092002@localhost:5432/patientdb"

engine = create_engine(DATABASE_URL, echo=True)  # echo=True pour voir les requêtes SQL dans le terminal
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

# Création de la table (à lancer une seule fois)
if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    print("Table créée avec succès !")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()