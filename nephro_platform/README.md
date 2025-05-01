# Plateforme Médicale de Néphrologie

Ce projet propose une plateforme intégrant une API pour la prédiction du risque néphrologique (basée sur l’IA) et un tableau de bord interactif (BI) pour l’analyse des données.

## Structure du Projet

- **backend/**
  - `app.py` : API FastAPI pour la prédiction.
  - `models.py` : Schémas Pydantic pour la validation des données.
  - `ai.py` : Module de prédiction (intelligence artificielle).
  - `dashboard.py` : Tableau de bord interactif avec Dash.
  - `requirements.txt` : Dépendances Python.
- **frontend/**
  - `index.html` : Interface web simple pour tester l’API.
- **Dockerfile** et **docker-compose.yml** (optionnels) pour containeriser le projet.

## Installation

1. **Cloner le projet :**

   ```bash
   git clone <URL_DU_REPO>
   cd nephro_platform
