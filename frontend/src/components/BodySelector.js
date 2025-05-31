import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    id: 1,
    text: "Ressentez-vous l’un de ces symptômes : douleur au bas du dos, fatigue ou gonflement des jambes ?",
    symptomMap: {
      "Douleur au bas du dos": "Douleurs dans le bas du dos",
      "Fatigue légère": "Fatigue",
      "Fatigue constante": "Fatigue excessive",
      "Gonflement des jambes": "Gonflement des chevilles"
    },
    options: ["Aucun symptôme", "Douleur au bas du dos", "Fatigue légère", "Fatigue constante", "Gonflement des jambes"]
  },
  {
    id: 2,
    text: "Votre urine a-t-elle changé ? (couleur, odeur, quantité) ou avez-vous ressenti des nausées ?",
    symptomMap: {
      "Urine foncée ou malodorante": "Urines foncées ou rouges",
      "Urine mousseuse": "Urine mousseuse",
      "Urine moins abondante": "Réduction de la quantité d'urine",
      "Nausées fréquentes": "Nausées et vomissements"
    },
    options: ["Aucun symptôme", "Urine foncée ou malodorante", "Urine mousseuse", "Urine moins abondante", "Nausées fréquentes"]
  },
  {
    id: 3,
    text: "Avez-vous remarqué d'autres signes comme perte d'appétit, démangeaisons ou confusion ?",
    symptomMap: {
      "Perte d'appétit": "Perte d'appétit",
      "Démangeaisons": "Démangeaisons persistantes",
      "Confusion": "Confusion",
      "Anémie": "Anémie"
    },
    options: ["Aucun symptôme", "Perte d'appétit", "Démangeaisons", "Confusion", "Anémie"]
  }
];

export default function BodySelector({ onDone }) {
  const [step, setStep] = useState(-1);
  const [chat, setChat] = useState([]);
  const [writing, setWriting] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [backendResults, setBackendResults] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (step === -1) {
      setWriting(true);
      setTimeout(() => {
        setChat([{ type: "bot", text: "Bonjour ! Je vais vous poser quelques questions." }]);
        setWriting(false);
        setTimeout(() => setStep(0), 500);
      }, 800);
    } else if (step < questions.length && !writing) {
      setWriting(true);
      setTimeout(() => {
        setChat(prev => [...prev, { type: "bot", text: questions[step].text }]);
        setWriting(false);
        setSelectedOptions([]);
      }, 600);
    }
  }, [step]);

  const handleCheckboxChange = (option) => {
    if (option === "Aucun symptôme") {
      setSelectedOptions(["Aucun symptôme"]);
    } else {
      setSelectedOptions(prev =>
        prev.includes(option)
          ? prev.filter(o => o !== option)
          : [...prev.filter(o => o !== "Aucun symptôme"), option]
      );
    }
  };

  const handleNext = async () => {
    const current = questions[step];
    setChat(prev => [...prev, { type: "user", text: selectedOptions.join(", ") || "Aucun" }]);

    if (!selectedOptions.includes("Aucun symptôme")) {
      const newSymptoms = selectedOptions.map(opt => current.symptomMap[opt]).filter(Boolean);
      setSymptoms(prev => [...new Set([...prev, ...newSymptoms])]);
    }

    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      try {
        const response = await fetch("http://localhost:8000/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symptoms })
        });
        const data = await response.json();
        setBackendResults(data);
      } catch (error) {
        setBackendResults({
          message: "❌ Erreur lors de la connexion au serveur.",
          possible_diseases: []
        });
      }
    }
  };

  return (
    <div style={{
      maxWidth: "700px",
      margin: "2rem auto",
      padding: "2rem",
      backgroundColor: "#e8f5f9",
      borderRadius: "1rem",
      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
      fontFamily: "Arial"
    }}>
      <h2 style={{ textAlign: "center", color: "#2BBBAD" }}>👩‍⚕️ Assistant Santé Rénale</h2>

      <div style={{
        backgroundColor: "#fff",
        borderRadius: "1rem",
        padding: "1.5rem",
        minHeight: "300px",
        marginBottom: "1.5rem",
        boxShadow: "0 0 12px rgba(0,0,0,0.06)"
      }}>
        {chat.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.type === "bot" ? "left" : "right", marginBottom: "0.75rem" }}>
            <div style={{
              display: "inline-block",
              padding: "10px 15px",
              borderRadius: "1rem",
              backgroundColor: msg.type === "bot" ? "#d1f4f0" : "#c7ffc7",
              maxWidth: "75%"
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {writing && <p>⌛ Assistant est en train d’écrire...</p>}
      </div>

      {!backendResults && !writing && step >= 0 && step < questions.length && (
        <>
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "0.75rem",
            marginTop: "1rem"
          }}>
            {questions[step].options.map(option => {
              const isSelected = selectedOptions.includes(option);
              return (
                <button
                  key={option}
                  onClick={() => handleCheckboxChange(option)}
                  style={{
                    padding: "0.6rem 1rem",
                    borderRadius: "30px",
                    border: isSelected ? "2px solid #2BBBAD" : "2px solid #ccc",
                    backgroundColor: isSelected ? "#2BBBAD" : "#fff",
                    color: isSelected ? "#fff" : "#333",
                    cursor: "pointer",
                    fontSize: "14px",
                    transition: "all 0.3s ease"
                  }}
                >
                  {option}
                </button>
              );
            })}
          </div>
          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button
              onClick={handleNext}
              style={{
                padding: "0.6rem 1.5rem",
                backgroundColor: "#2BBBAD",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                cursor: "pointer"
              }}
            >
              Suivant
            </button>
          </div>
        </>
      )}

      {backendResults && (
        <div>
          <h3 style={{ color: "#333" }}>🔍 Résultats basés sur vos réponses :</h3>
          <p>{backendResults.message}</p>
          {backendResults.possible_diseases?.map((item, i) => (
            <div key={i} style={{
              backgroundColor: "#ffffff",
              padding: "1rem",
              borderRadius: "0.5rem",
              marginTop: "1rem",
              boxShadow: "0 0 8px rgba(0,0,0,0.05)"
            }}>
              <strong>🦠 Maladie suspectée :</strong> {item.disease}
              <ul>
                <li>🧍 Symptômes détectés : {item.matching_symptoms.join(", ")}</li>
                <li>🧪 Analyses recommandées : {item.required_analyses.join(", ")}</li>
              </ul>
            </div>
          ))}
          <div style={{ textAlign: "center" }}>
            <button
              onClick={onDone}
              style={{
                marginTop: "2rem",
                padding: "0.8rem 2rem",
                backgroundColor: "#2BBBAD",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              ✅ J’ai fait ces analyses
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
