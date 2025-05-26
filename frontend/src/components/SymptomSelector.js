import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const groupedQuestions = [
  {
    question: "Avez-vous remarqué un changement dans votre urine ?",
    options: [
      { label: "Urine mousseuse", value: "Urine mousseuse" },
      { label: "Urines foncées ou rouges", value: "Urines foncées ou rouges" },
      { label: "Réduction de la quantité d'urine", value: "Réduction de la quantité d'urine" }
    ]
  },
  {
    question: "Avez-vous des gonflements inhabituels ?",
    options: [
      { label: "Gonflement des chevilles", value: "Gonflement des chevilles" },
      { label: "Gonflement des pieds", value: "Gonflement des pieds" },
      { label: "Rétention de liquides", value: "Rétention de liquides" }
    ]
  },
  {
    question: "Vous sentez-vous fatigué(e) ou essoufflé(e) ?",
    options: [
      { label: "Fatigue", value: "Fatigue" },
      { label: "Fatigue excessive", value: "Fatigue excessive" },
      { label: "Fatigue intense", value: "Fatigue intense" },
      { label: "Essoufflement", value: "Essoufflement" }
    ]
  },
  {
    question: "Votre tension artérielle est-elle élevée ?",
    options: [
      { label: "Hypertension artérielle", value: "Hypertension artérielle" },
      { label: "Pression artérielle élevée", value: "Pression artérielle élevée" }
    ]
  },
  {
    question: "Avez-vous des troubles digestifs ?",
    options: [
      { label: "Perte d'appétit", value: "Perte d'appétit" },
      { label: "Nausées et vomissements", value: "Nausées et vomissements" }
    ]
  },
  {
    question: "Avez-vous remarqué un ou plusieurs de ces symptômes ?",
    options: [
      { label: "Douleurs dans le bas du dos", value: "Douleurs dans le bas du dos" },
      { label: "Anémie", value: "Anémie" },
      { label: "Confusion", value: "Confusion" },
      { label: "Démangeaisons persistantes", value: "Démangeaisons persistantes" }
    ]
  }
];

export default function RenalSymptomChat() {
  const [step, setStep] = useState(0);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [backendResults, setBackendResults] = useState(null);
  const navigate = useNavigate();

  const handleCheckboxChange = (value) => {
    setSelectedSymptoms((prev) =>
      prev.includes(value)
        ? prev.filter((s) => s !== value)
        : [...prev, value]
    );
  };

  const handleNext = async () => {
    if (step + 1 < groupedQuestions.length) {
      setStep(step + 1);
    } else {
      try {
        const response = await fetch("http://localhost:8000/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symptoms: selectedSymptoms })
        });
        const data = await response.json();
        setBackendResults(data);
      } catch (error) {
        setBackendResults({ message: "❌ Erreur lors de la connexion au serveur." });
      }
    }
  };

  const handleContinue = () => {
    navigate("/app"); // redirection vers la page des analyses
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem", backgroundColor: "#f2f5f8", borderRadius: "1rem", fontFamily: "Arial" }}>
      <h2 style={{ textAlign: "center" }}>👩‍⚕️ Assistant Santé Rénale</h2>

      {!backendResults ? (
        <div>
          <h4>{groupedQuestions[step].question}</h4>
          <div style={{ textAlign: "left" }}>
            {groupedQuestions[step].options.map((opt) => (
              <label key={opt.value} style={{ display: "block", marginBottom: "0.5rem" }}>
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={selectedSymptoms.includes(opt.value)}
                  onChange={() => handleCheckboxChange(opt.value)}
                  style={{ marginRight: "0.5rem" }}
                />
                {opt.label}
              </label>
            ))}
          </div>
          <button
            onClick={handleNext}
            style={{ marginTop: "1rem", padding: "0.5rem 1rem", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "5px" }}
          >
            {step + 1 < groupedQuestions.length ? "Suivant" : "Voir résultats"}
          </button>
        </div>
      ) : (
        <div>
          <h3>🧾 Résultats basés sur vos réponses :</h3>
          <p>{backendResults.message}</p>
          {backendResults.possible_diseases?.map((item, i) => (
            <div key={i} style={{ marginBottom: "1rem" }}>
              <strong>🦠 Maladie suspectée :</strong> {item.disease}
              <ul>
                <li>🧍 Symptômes détectés : {item.matching_symptoms.join(", ")}</li>
                <li>🧪 Analyses recommandées : {item.required_analyses.join(", ")}</li>
              </ul>
            </div>
          ))}
          <button
            onClick={handleContinue}
            style={{ marginTop: "1.5rem", padding: "12px 25px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            ✅ J’ai fait ces analyses
          </button>
        </div>
      )}
    </div>
  );
}
