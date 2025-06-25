import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Lottie from "lottie-react";
import doctorAnimation from "../assets/doctor-lottie.json";
import doctorAvatar from "../assets/doctor-avatar.png";
import userAvatar from "../assets/user-avatar.png";
import sideImage from "../assets/kidney-side.avif";
import kidneyAnimation from "../assets/kidney-lottie.json";

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
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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
      finishConversation();
    }
  };

  const finishConversation = async () => {
    setWriting(true);
    await delay(1000);
    setChat(prev => [...prev, { type: "bot", text: "Merci. Je vais maintenant analyser vos réponses..." }]);
    try {
      const response = await fetch("http://127.0.0.1:8000/assistant/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms })
      });
      const data = await response.json();
      setBackendResults(data);
      const prediction = await fetch("http://127.0.0.1:8000/predict/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.recommanded_tests.reduce((acc, curr) => {
          acc[curr] = 0;
          return acc;
        }, {}))
      });
    } catch (error) {
      setChat(prev => [...prev, { type: "bot", text: "Erreur lors de l'analyse." }]);
    } finally {
      setWriting(false);
    }
  };

  const goToApp = () => {
    navigate("/SymptomSelector");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #2BBBAD 0%, #43e97b 100%)"
    }}>
      <nav style={{
        backgroundImage: "linear-gradient(90deg, #2BBBAD 45%, #43e97b 100%)",
        color: "#fff",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        borderTopLeftRadius: "2rem",
        borderTopRightRadius: "2rem",
        margin: "0 auto",
        width: "calc(100% - 4rem)"
      }}>
        <div style={{ fontWeight: "bold", fontSize: "1.3rem" }}>NephroPlatform</div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Accueil</Link>
          <Link to="/predict" style={{ color: "#fff", textDecoration: "none" }}>Prédiction</Link>
          <span style={{ color: "#fff", textDecoration: "none", cursor: "default" }}>Assistant</span>
          <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>Se déconnecter</Link>
        </div>
      </nav>

      <div style={{
        paddingTop: "80px",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "2rem",
        padding: "3rem 5%"
      }}>
        <div style={{
          flex: "1 1 500px",
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "1rem",
          boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
        }}>
          <div style={{ marginTop: "2rem", minHeight: "300px" }}>
            {chat.map((msg, idx) => (
              <div key={idx} style={{
                display: "flex",
                justifyContent: msg.type === "bot" ? "flex-start" : "flex-end",
                marginBottom: "1rem",
                alignItems: "center"
              }}>
                {msg.type === "bot" && (
                  <Lottie animationData={doctorAnimation} loop={true} style={{ width: "60px", height: "60px", marginRight: "10px" }} />
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
            <div style={{
              marginTop: "2.2rem",
              background: "#f0faf8",
              borderLeft: "6px solid #2BBBAD",
              borderRadius: "1rem",
              padding: "2rem 1.5rem",
              boxShadow: "0 4px 12px rgba(34,160,137,0.08)"
            }}>
              <h2 style={{
                color: "#22a089",
                fontWeight: "bold",
                fontSize: "1.45rem",
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem"
              }}>
                <span role="img" aria-label="loupe" style={{ marginRight: "0.7rem", fontSize: 22 }}></span>
                Résultats de l'analyse
              </h2>
              <p style={{ color: "#444", fontSize: "1.1rem", marginBottom: "1.5rem" }}>
                {backendResults.message}
              </p>
              {backendResults.possible_diseases?.map((item, i) => (
                <div key={i} style={{
                  background: "#fff",
                  borderRadius: "1rem",
                  margin: "1.2rem 0",
                  padding: "1.25rem 1.2rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#2BBBAD",
                    fontWeight: "bold",
                    fontSize: "1.15rem",
                    marginBottom: "0.8rem"
                  }}>
                    <span role="img" aria-label="bacteria" style={{ marginRight: "0.6rem", fontSize: 20 }}></span>
                    Maladie suspectée : {item.disease}
                  </div>
                  <ul style={{ marginLeft: "1.5rem", color: "#444", fontSize: "1.03rem" }}>
                    <li>
                      <span role="img" aria-label="symptome" style={{ marginRight: "0.3rem" }}></span>
                      <strong>Symptômes :</strong> {item.matching_symptoms.join(", ")}
                    </li>
                    <li>
                      <span role="img" aria-label="analyse" style={{ marginRight: "0.3rem" }}></span>
                      <strong>Analyses recommandées :</strong> {item.required_analyses.join(", ")}
                    </li>
                  </ul>
                </div>
              ))}
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <button
                  onClick={() => navigate("/predict")}
                  style={{
                    padding: "0.9rem 2.5rem",
                    background: "linear-gradient(90deg,#2BBBAD 60%,#43e97b 100%)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "1rem",
                    fontSize: "1.17rem",
                    fontWeight: "bold",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.12)"
                  }}
                >
                   J’ai fait ces analyses
                </button>
              </div>
            </div>
          )}
        </div>
        <div style={{
          flex: "0 1 300px",
          backgroundColor: "#ffffff",
          padding: "1.5rem",
          borderRadius: "1rem",
          boxShadow: "0 8px 16px rgba(0,0,0,0.05)",
          textAlign: "center"
        }}>
          <Lottie animationData={kidneyAnimation} loop={true} alt="kidney health" style={{ width: "100%", borderRadius: "0.5rem", marginBottom: "1rem" }} />
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
