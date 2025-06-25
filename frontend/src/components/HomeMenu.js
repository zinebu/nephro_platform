import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import assistantLottie from "../assets/doctor-lottie.json";
import predictLottie from "../assets/predict-lottie.json";
import historyLottie from "../assets/history-lottie.json";
import axios from "axios";

const HomeMenu = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    if (email) {
      axios
        .post("http://localhost:8000/patient-info", { email })
        .then((res) => setPatient(res.data))
        .catch((err) => console.error("Erreur patient:", err));
    }
  }, [email]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #2BBBAD 0%, #43e97b 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "2rem",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "stretch",
          maxWidth: "1200px",
          width: "100%",
        }}
      >
        {/* Cadre Profil */}
        <div
          style={{
            flex: "1 1 300px",
            background: "#fff",
            borderRadius: "20px",
            padding: "2rem",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              backgroundColor: "#e0f7f1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              color: "#2BBBAD",
              fontWeight: "bold",
              marginBottom: "1rem",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          >
            {patient?.prenom?.charAt(0).toUpperCase() || "?"}
          </div>
          <h2 style={{ margin: 0, color: "#2BBBAD", fontSize: "24px", fontWeight: "600" }}>
            {patient?.prenom} {patient?.nom}
          </h2>
          <p style={{ marginTop: "1rem", fontSize: "16px", color: "#555", lineHeight: "1.7" }}>
            <strong>Sexe :</strong> {patient?.sexe}<br />
            <strong>Âge :</strong> {patient?.age} ans<br />
            <strong>Origine :</strong> {patient?.origine}
          </p>
        </div>

        {/* Cadre Actions */}
        <div
          style={{
            flex: "1 1 400px",
            background: "#fff",
            borderRadius: "20px",
            padding: "2rem",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "1.5rem",
          }}
        >
          <h3 style={{ textAlign: "center", color: "#17b978", fontSize: "22px", fontWeight: "600" }}>
            Que souhaitez-vous faire ?
          </h3>

          <MenuItem
            animation={assistantLottie}
            label="Utiliser l’assistant"
            color="#2BBBAD"
            onClick={() => navigate("/assistant")}
          />
          <MenuItem
            animation={predictLottie}
            label="Faire une prédiction"
            color="#43e97b"
            onClick={() => navigate("/predict")}
          />
          <MenuItem
            animation={historyLottie}
            label="Voir l’historique"
            color="#17b978"
            onClick={() => navigate("/historique")}
          />
        </div>
      </div>
    </div>
  );
};

const MenuItem = ({ animation, label, color, onClick }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <Lottie animationData={animation} loop style={{ width: 70, height: 70 }} />
    <button
      onClick={onClick}
      style={{
        flex: 1,
        background: color,
        color: "#fff",
        border: "none",
        borderRadius: "1rem",
        padding: "1rem 1.5rem",
        fontSize: "16px",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "transform 0.3s ease",
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {label}
    </button>
  </div>
);

export default HomeMenu;
