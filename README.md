# RENALYS

**RENALYS** is an intelligent medical web application designed to assist healthcare professionals in **detecting kidney diseases** using **machine learning**.  
The platform integrates a **Flask backend**, **Fastapi Microservices** a **React frontend**, and a **PostgreSQL database** to manage patient data and AI-based predictions.

> 👥 Collaborative project developed by [@salmaayache22](https://github.com/salmaayache22) and [@zinebu](https://github.com/zinebu)

---


## Features

- 🔐 **Authentication** — secure login and registration (doctor/patient)
- 🤖 **AI Chatbot Assistant** — helps users understand medical terms and suggest analyses
- 🧠 **AI Prediction** — predicts kidney diseases using medical parameters (creatinine, glucose, age, etc.)
- 📊 **Prediction History** — saves and displays all past predictions for each user
- 💾 **PostgreSQL Database** — stores users, predictions, and medical data

---

## Tech Stack

- **Backend:** FastAPI (Python), Flask
- **Frontend:** React + Tailwind CSS
- **Database:** PostgreSQL
- **Machine Learning:** Scikit-learn, RandomForest
  

---


1. **Cloner le projet :**

   ```bash
    git clone https://github.com/zinebu/nephro_platform

## How to Run


```bash

python -m venv .venv
# Activate:
# Windows → .venv\Scripts\activate
# macOS/Linux → source .venv/bin/activate
pip install -r requirements.txt
##Backend
cd Backend
python -m uvicorn app:app --reload

##Frontend
cd Frontend
npm start

