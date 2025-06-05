from flask import Flask, request, jsonify
import traceback

app = Flask(__name__)

# Symptômes et analyses par maladie
SYMPTOMS_ANALYSES = {
    "Glomérulonéphrite": {
        "symptoms": [
            "Urine mousseuse", "Gonflement des chevilles", "Fatigue", "Hypertension artérielle",
            "Douleurs dans le bas du dos", "Urines foncées ou rouges", "Perte d'appétit",
            "Nausées et vomissements"
        ],
        "analyses": ["rbc", "pcc", "sg", ]
    },
    "Insuffisance rénale aiguë": {
        "symptoms": [
            "Réduction de la quantité d'urine", "Rétention de liquides", "Essoufflement",
            "Confusion", "Nausées et vomissements", "Fatigue intense", "Pression artérielle élevée",
            "Douleurs dans le bas du dos"
        ],
        "analyses": ["sc", "bu", "pot", "bp"]
    },
    "Maladie rénale chronique": {
        "symptoms": [
            "Fatigue excessive", "Gonflement des pieds", "Urine mousseuse", "Hypertension artérielle",
            "Perte d'appétit", "Nausées et vomissements", "Anémie", "Démangeaisons persistantes",
            "Douleurs dans le bas du dos"
        ],
        "analyses": ["bu", "sc", "bgr", "sod", "hemo"]
    },
    # Ajoute d'autres maladies si nécessaire
}

@app.post("/assistant")
def assistant():
    try:
        data = request.get_json()
        print("🧾 Symptômes reçus :", data)

        symptoms = data.get('symptoms', [])
        if not symptoms:
            return jsonify({"message": "Aucun symptôme n'a été fourni."}), 400

        possible_diseases = []

        for disease, details in SYMPTOMS_ANALYSES.items():
            matching = list(set(symptoms) & set(details["symptoms"]))
            if matching:
                missing_analyses = [a for a in details["analyses"] if a not in data]
                possible_diseases.append({
                    "disease": disease,
                    "matching_symptoms": matching,
                    "required_analyses": missing_analyses
                })

        if possible_diseases:
            print("🎯 Maladies possibles :", possible_diseases)
            return jsonify({
                "message": f"{len(possible_diseases)} maladie(s) trouvée(s) basée(s) sur vos symptômes.",
                "possible_diseases": possible_diseases
            }), 200
        else:
            return jsonify({
                "message": "Aucune maladie trouvée. Essayez d'ajouter plus de symptômes ou d'analyses."
            }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# Tu peux aussi garder /predict ici si nécessaire
# @app.post("/predict") ...

if __name__ == "__main__":
    app.run(debug=True)             

    