from rest_framework.decorators import api_view
from rest_framework.response import Response

# Les symptômes et les analyses associées
SYMPTOMS_ANALYSES = {
    "Glomérulonéphrite": {
        "symptoms": [
            "Urine mousseuse", "Gonflement des chevilles", "Fatigue", "Hypertension artérielle", 
            "Douleurs dans le bas du dos", "Urines foncées ou rouges", "Perte d'appétit", 
            "Nausées et vomissements"
        ],
        "analyses": ["rbc", "pcc", "sg"]
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
    # Ajoute les autres maladies ici de manière similaire...
}

@api_view(['POST'])
def assistant(request):
    try:
        # Prendre les symptômes envoyés dans la requête
        symptoms = request.data.get('symptoms', [])

        if not symptoms:
            return Response({"message": "Aucun symptôme n'a été fourni."}, status=400)

        # Trouver les maladies possibles basées sur les symptômes
        possible_diseases = []
        for disease, data in SYMPTOMS_ANALYSES.items():
            matching_symptoms = set(symptoms).intersection(set(data["symptoms"]))
            
            if matching_symptoms:
                # Si des symptômes correspondent, suggérer les analyses nécessaires
                missing_analyses = [analysis for analysis in data["analyses"] if analysis not in request.data]

                possible_diseases.append({
                    "disease": disease,
                    "matching_symptoms": list(matching_symptoms),
                    "required_analyses": missing_analyses,
                })

        if possible_diseases:
            return Response({
                "message": f"{len(possible_diseases)} maladie(s) trouvée(s) basée(s) sur vos symptômes.",
                "possible_diseases": possible_diseases,
            })
        else:
            return Response({
                "message": "Aucune maladie trouvée. Essayez d'ajouter plus de symptômes ou d'analyses.",
            })

    except Exception as e:
        return Response({"error": str(e)}, status=500)
