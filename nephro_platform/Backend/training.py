import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.metrics import classification_report
from imblearn.over_sampling import SMOTE
import pickle
import os

# 1. Charger le fichier CSV
df = pd.read_csv("data/kidney_disease.csv")

# 2. Nettoyer les chaînes de caractères
df = df.applymap(lambda x: x.strip() if isinstance(x, str) else x)

# 3. Remplacer les étiquettes de classification
df["classification"] = df["classification"].replace({
    "ckd": 1,
    "notckd": 0
})

# 4. Supprimer la colonne ID si elle existe
df.drop(columns=["id"], inplace=True, errors="ignore")

# 5. Supprimer les colonnes avec plus de 50% de valeurs manquantes
df = df.dropna(thresh=len(df) * 0.5, axis=1)

# 6. Encoder les colonnes catégoriques
label_encoders = {}
for col in df.select_dtypes(include="object").columns:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col].astype(str))
    label_encoders[col] = le

# 7. Séparer X et y
X = df.drop("classification", axis=1)
y = df["classification"]

# 8. Appliquer SimpleImputer (au lieu de fillna manuel)
imputer = SimpleImputer(strategy="mean")
X_imputed = imputer.fit_transform(X)

# 9. Mise à l’échelle
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_imputed)

# 10. Appliquer SMOTE pour équilibrer les classes
smote = SMOTE(random_state=42)
X_resampled, y_resampled = smote.fit_resample(X_scaled, y)

# 11. Séparer les données
X_train, X_test, y_train, y_test = train_test_split(
    X_resampled, y_resampled, test_size=0.2, random_state=42
)

# 12. Entraîner le modèle
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 13. Évaluer
y_pred = model.predict(X_test)
print("\n✅ Rapport de classification :")
print(classification_report(y_test, y_pred))

# 14. Sauvegarde
with open("model.pkl", "wb") as f:
    pickle.dump({
        "model": model,
        "scaler": scaler,
        "encoders": label_encoders,
        "columns": X.columns.tolist(),
        "imputer": imputer
    }, f)

print("\n✅ Modèle entraîné et sauvegardé dans model.pkl")