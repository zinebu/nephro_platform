import React, { useState, useEffect } from "react";

const questions = [
  { id: 1, text: "Bonjour ! Ressentez-vous une douleur au bas du dos ?", options: ["Aucune douleur", "Légère gêne", "Douleur modérée", "Douleur intense"] },
  { id: 2, text: "Avez-vous remarqué un gonflement des chevilles ou des jambes ?", options: ["Non", "Parfois en fin de journée", "Souvent le matin", "Toujours gonflées"] },
  { id: 3, text: "Votre urine a-t-elle changé de couleur ou d’odeur ?", options: ["Pas du tout", "Légère différence", "Changement notable", "Urine foncée ou malodorante"] },
  { id: 4, text: "Ressentez-vous une fatigue excessive ces derniers temps ?", options: ["Non, je suis en forme", "Fatigue légère", "Fatigue fréquente", "Fatigue constante"] },
  { id: 5, text: "Souffrez-vous de nausées ou de perte d’appétit ?", options: ["Non", "Nausées occasionnelles", "Perte d’appétit régulière", "Nausées fréquentes et perte d’appétit"] }
];

const analysesSuggerees = [
  "Créatinine",
  "Urée",
  "Analyse d'urine complète",
  "Débit de filtration glomérulaire (DFG)",
  "Protéinurie"
];

export default function RenalSymptomChat({ onContinue }) {
  const [step, setStep] = useState(-1);
  const [chat, setChat] = useState([]);
  const [writing, setWriting] = useState(false);
  const [responses, setResponses] = useState({});
  const [showResults, setShowResults] = useState(false);

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
      }, 600);
    }
  }, [step]);

  const handleUserResponse = (answer) => {
    const currentQuestion = questions[step];
    setResponses(prev => ({ ...prev, [currentQuestion.id]: answer }));
    setChat(prev => [...prev, { type: "user", text: answer }]);
    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem", backgroundColor: "#f2f5f8", borderRadius: "1rem", fontFamily: "Arial" }}>
      <h2 style={{ textAlign: "center" }}>👩‍⚕️ Assistant Santé Rénale</h2>

      <div style={{ backgroundColor: "white", borderRadius: "0.5rem", padding: "1rem", minHeight: "300px", marginBottom: "1rem", boxShadow: "0 0 10px rgba(0,0,0,0.05)" }}>
        {chat.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.type === "bot" ? "left" : "right", marginBottom: "0.5rem" }}>
            <div style={{
              display: "inline-block",
              padding: "10px",
              borderRadius: "1rem",
              backgroundColor: msg.type === "bot" ? "#e0f0ff" : "#c7ffc7",
              maxWidth: "75%"
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {writing && <p>Assistant est en train d’écrire...</p>}
      </div>

      {!showResults && !writing && step >= 0 && step < questions.length && (
        <div style={{ textAlign: "center" }}>
          {questions[step].options.map((label) => (
            <button
              key={label}
              onClick={() => handleUserResponse(label)}
              style={{
                margin: "0.3rem",
                padding: "0.5rem 1rem",
                border: "none",
                borderRadius: "20px",
                backgroundColor: "#007bff",
                color: "white",
                cursor: "pointer",
                display: "block",
                width: "80%",
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {showResults && (
        <div>
          <h3>🔍 D’après vos réponses, voici les analyses recommandées :</h3>
          <ul>
            {analysesSuggerees.map((a, i) => (
              <li key={i}>✅ {a}</li>
            ))}
          </ul>
          <button
            onClick={onContinue}
            style={{
              marginTop: "1.5rem",
              padding: "12px 25px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            J’ai fait ces analyses
          </button>
        </div>
      )}
    </div>
  );
}
