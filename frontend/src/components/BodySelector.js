import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import doctorAvatar from "../assets/doctor-avatar.png"; // image médecin
import userAvatar from "../assets/user-avatar.png";     // image utilisateur
import sideImage from "../assets/kidney-side.avif";      // image côté (ex: rein ou soin)

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
        setChat([{ type: "bot", text: "Bonjour 👋 ! Je vais vous poser quelques questions sur vos symptômes." }]);
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
    <div style={{ backgroundColor: "#e8f5f9", minHeight: "100vh" }}>
      {/* Navbar */}
      <nav style={{
        backgroundColor: "#2BBBAD",
        padding: "1rem 5%",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
      }}>
        <div style={{ fontWeight: "bold", fontSize: "1.3rem" }}>NephroPlatform</div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Accueil</Link>
          <Link to="/chatbot" style={{ color: "#fff", textDecoration: "none" }}>Assistant</Link>
          <Link to="/app" style={{ color: "#fff", textDecoration: "none" }}>Prédiction</Link>
        </div>
      </nav>

      {/* Contenu principal */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "2rem",
        padding: "3rem 5%"
      }}>
        {/* Chatbot principal */}
        <div style={{
          flex: "1 1 500px",
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ textAlign: "center", color: "#2BBBAD" }}>💬 Assistant Santé Rénale</h2>

          <div style={{ marginTop: "2rem", minHeight: "300px" }}>
            {chat.map((msg, idx) => (
              <div key={idx} style={{
                display: "flex",
                justifyContent: msg.type === "bot" ? "flex-start" : "flex-end",
                marginBottom: "1rem",
                alignItems: "center"
              }}>
                {msg.type === "bot" && (
                  <img src={doctorAvatar} alt="bot" style={{ width: "40px", height: "40px", marginRight: "10px" }} />
                )}
                <div style={{
                  backgroundColor: msg.type === "bot" ? "#e0f7f4" : "#d1ffd6",
                  padding: "0.8rem 1.2rem",
                  borderRadius: "1rem",
                  maxWidth: "75%"
                }}>
                  {msg.text}
                </div>
                {msg.type === "user" && (
                  <img src={userAvatar} alt="user" style={{ width: "40px", height: "40px", marginLeft: "10px" }} />
                )}
              </div>
            ))}
            {writing && <p>⌛ Assistant est en train d’écrire...</p>}
          </div>

          {!backendResults && !writing && step >= 0 && step < questions.length && (
            <>
              <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.5rem",
                marginTop: "1.5rem",
                justifyContent: "center"
              }}>
                {questions[step].options.map(option => {
                  const isSelected = selectedOptions.includes(option);
                  return (
                    <button
                      key={option}
                      onClick={() => handleCheckboxChange(option)}
                      style={{
                        padding: "0.5rem 1rem",
                        borderRadius: "25px",
                        border: isSelected ? "2px solid #2BBBAD" : "1px solid #ccc",
                        backgroundColor: isSelected ? "#2BBBAD" : "#fff",
                        color: isSelected ? "#fff" : "#333",
                        cursor: "pointer"
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
                    padding: "0.7rem 2rem",
                    backgroundColor: "#2BBBAD",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
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
            <div style={{ marginTop: "2rem" }}>
              <h3>🔍 Résultats d'analyse</h3>
              <p>{backendResults.message}</p>
              {backendResults.possible_diseases?.map((item, i) => (
                <div key={i} style={{
                  backgroundColor: "#f8f8f8",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  marginTop: "1rem"
                }}>
                  <strong>🦠 Maladie suspectée :</strong> {item.disease}
                  <ul>
                    <li>🧍 Symptômes : {item.matching_symptoms.join(", ")}</li>
                    <li>🧪 Analyses recommandées : {item.required_analyses.join(", ")}</li>
                  </ul>
                </div>
              ))}
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <button
                  onClick={onDone}
                  style={{
                    padding: "0.8rem 2rem",
                    backgroundColor: "#2BBBAD",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "16px",
                    cursor: "pointer"
                  }}
                >
                  ✅ J’ai fait ces analyses
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Côté informatif */}
        <div style={{
          flex: "0 1 300px",
          backgroundColor: "#ffffff",
          padding: "1.5rem",
          borderRadius: "1rem",
          boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
          textAlign: "center"
        }}>
          <img src={sideImage} alt="kidney health" style={{ width: "100%", borderRadius: "0.5rem", marginBottom: "1rem" }} />
          <h4 style={{ color: "#2BBBAD" }}>🔎 Conseil du jour</h4>
          <p style={{ fontSize: "0.95rem", color: "#555", lineHeight: "1.6" }}>
            Boire de l'eau régulièrement aide à prévenir les calculs rénaux et favorise la filtration naturelle.
          </p>
          <button style={{
            marginTop: "1rem",
            padding: "0.6rem 1.2rem",
            backgroundColor: "#2BBBAD",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}>
            Lire plus
          </button>
        </div>
      </div>
    </div>
  );
}
