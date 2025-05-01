import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.metrics import classification_report
from sklearn.preprocessing import LabelEncoder
from sklearn.utils.multiclass import unique_labels
from xgboost import XGBClassifier
import pickle

# 1. Charger le fichier enrichi avec cas équilibrés
df = pd.read_excel("data/kidney_disease.xlsx")

# 2. Encoder la cible (nom de diagnostic) → label numérique
le_target = LabelEncoder()
df["diagnostic_class"] = le_target.fit_transform(df["diagnostic_nom"])

# 3. Supprimer colonnes inutiles
df.drop(columns=["diagnostic_nom", "classification"], inplace=True, errors="ignore")

# 4. Séparer X et y
X = df.drop(columns=["diagnostic_class"])
y = df["diagnostic_class"]

# Supprimer les classes avec < 2 instances (stratify exige au moins 2 exemples)
counts = y.value_counts()
valid_classes = counts[counts >= 2].index
mask = y.isin(valid_classes)
X = X[mask]
y = y[mask]

# 5. Imputation et mise à l’échelle
imputer = SimpleImputer(strategy="mean")
X_imputed = imputer.fit_transform(X)

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_imputed)

# 6. Split des données
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, stratify=y, random_state=42
)

# 7. Entraînement du modèle XGBoost
model = XGBClassifier(
    use_label_encoder=False,
    eval_metric="mlogloss",  # adapté pour la classification multi-classe
    n_estimators=150,
    learning_rate=0.1,
    max_depth=4,
    random_state=42
)
model.fit(X_train, y_train)

# 8. Évaluation
y_pred = model.predict(X_test)
labels = unique_labels(y_test, y_pred)
target_names = [le_target.classes_[i] for i in labels]
print("\n✅ Rapport de classification :")
print(classification_report(y_test, y_pred, labels=labels, target_names=target_names))

# 9. Sauvegarde
with open("model.pkl", "wb") as f:
    pickle.dump({
        "model": model,
        "scaler": scaler,
        "imputer": imputer,
        "columns": X.columns.tolist(),
        "label_map": dict(zip(range(len(le_target.classes_)), le_target.classes_))
    }, f)

print("\n✅ Modèle XGBoost multi-classe sauvegardé dans model.pkl")
