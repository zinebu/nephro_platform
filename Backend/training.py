import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.impute import SimpleImputer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

# 1. Charger le dataset
df = pd.read_excel("data/kidney_disease.xlsx")

# 2. Extraire y (cible) et classification (colonne supplémentaire)
y = df["diagnostic_nom"]
classification = df["classification"]

# 3. Extraire les features (toutes sauf y et classification)
X = df.drop(["diagnostic_nom", "classification"], axis=1)

# 4. Encoder y
le = LabelEncoder()
y_encoded = le.fit_transform(y)

# 5. Split train/test (garder les index pour retrouver classification sur test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)

# 6. Pipeline Random Forest (imputation + RF)
rf_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="mean")),
    ("rf", RandomForestClassifier(n_estimators=100, random_state=42))
])

# 7. Entraîner
rf_pipeline.fit(X_train, y_train)

# 8. Prédictions
y_pred = rf_pipeline.predict(X_test)

# 9. Précision et rapport
print("Accuracy Random Forest:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred, target_names=le.classes_))

# 10. Matrice de confusion
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(10, 7))
sns.heatmap(cm, annot=True, fmt='d', cmap='Greens', xticklabels=le.classes_, yticklabels=le.classes_)
plt.xlabel('Classe prédite')
plt.ylabel('Classe réelle')
plt.title('Matrice de confusion - Random Forest')
plt.show()

# 11. Comparer diagnostic réel, prédiction, classification sur le test
classification_test = classification.loc[X_test.index]

result_df = pd.DataFrame({
    "diagnostic_reel": le.inverse_transform(y_test),
    "diagnostic_pred": le.inverse_transform(y_pred),
    "classification": classification_test
})

print(result_df.head(10))
