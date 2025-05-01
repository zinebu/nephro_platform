import pickle

# Charger le modèle
with open("model.pkl", "rb") as f:
    obj = pickle.load(f)

model = obj["model"]
scaler = obj["scaler"]
encoders = obj["encoders"]
columns = obj["columns"]

# Exemple de patient sain
patient = {
    "age": 35,
    "bp": 80,
    "sc": 0.9,
    "hemo": 14,
    "dm": "no",
    "htn": "no"
}

# Construction du vecteur d'entrée
x_input = []
for col in columns:
    val = patient.get(col, 0)
    if col in encoders:
        val = encoders[col].transform([val])[0] if val else 0
    x_input.append(val)

X_scaled = scaler.transform([x_input])
prediction = model.predict(X_scaled)[0]

print("🧠 Résultat prédiction :", "ckd" if prediction == 1 else "notckd")
