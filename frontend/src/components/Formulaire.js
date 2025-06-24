import React, { useState } from "react";
import axios from "axios";
import { FaFlask, FaDiagnoses } from "react-icons/fa";

const analysesList = [
  "age", "bp", "sg", "al", "su", "bgr", "bu", "sc", "sod", "pot",
  "hemo", "pcv", "wc", "rc", "htn", "dm", "cad", "appet", "pe", "ane",
  "rbc", "pc", "pcc", "ba"
];

const groupedAnalyses = [
  {
    title: "Paramètres de base",
    analyses: ["age", "bp", "sg", "al", "su"]
  },
  {
    title: "Biochimie",
    analyses: ["bgr", "bu", "sc", "sod", "pot"]
  },
  {
    title: "Sang",
    analyses: ["hemo", "pcv", "wc", "rc"]
  },
  {
    title: "Conditions cliniques",
    analyses: ["htn", "dm", "cad", "appet", "pe", "ane"]
  },
  {
    title: "Urinaire",
    analyses: ["rbc", "pc", "pcc", "ba"]
  }
];

const FormulaireAnalyses = () => {
  const [formData, setFormData] = useState({});
  const [resultats, setResultats] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/predict", {
        data: formData,
      });
      setResultats(response.data.diagnostics);
    } catch (error) {
      setResultats([
        {
          diagnostic: "Erreur",
          message: "Échec de la prédiction",
          recommandation: "Vérifiez les données saisies.",
        },
      ]);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom right, #e8f5f9, #f7fcff)", padding: "3rem 1rem" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", background: "#fff", borderRadius: "2rem", padding: "3rem", boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#2BBBAD", marginBottom: "1.5rem" }}>
          🧪 Analyse Médicale Personnalisée
        </h1>
        <p style={{ color: "#465661", fontSize: "1.125rem", marginBottom: "2rem" }}>
          Saisissez les résultats de vos analyses pour obtenir un diagnostic prédictif basé sur l’intelligence artificielle.
        </p>
        <form onSubmit={handleSubmit}>
          {groupedAnalyses.map((group, i) => (
            <div key={i} style={{ marginBottom: "2rem", padding: "1.5rem", backgroundColor: "#f9fcfc", borderRadius: "1rem", boxShadow: "0 2px 6px rgba(0,0,0,0.05)" }}>
              <h2 style={{ color: "#22a089", fontWeight: "bold", marginBottom: "1rem" }}>{group.title}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {group.analyses.map((analyse) => (
                  <div key={analyse} style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ fontWeight: 600, color: "#465661", marginBottom: "0.5rem" }}>{analyse.toUpperCase()}</label>
                    <input
                      type="text"
                      name={analyse}
                      onChange={handleChange}
                      style={{ border: "1px solid #ccd", borderRadius: "1rem", padding: "0.6rem 1rem", outline: "none", transition: "0.3s", fontSize: "1rem" }}
                      placeholder={`Entrer la valeur de ${analyse}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <button
              type="submit"
              style={{
                background: "linear-gradient(to right, #2BBBAD, #43e97b)",
                color: "white",
                padding: "0.85rem 2.5rem",
                fontSize: "1.125rem",
                fontWeight: "bold",
                borderRadius: "1rem",
                border: "none",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <FaFlask style={{ marginRight: "0.5rem" }} /> Lancer la prédiction
            </button>
          </div>
        </form>

        {resultats && (
          <div style={{ marginTop: "2rem", background: "#f0faf8", borderLeft: "4px solid #2BBBAD", borderRadius: "1rem", padding: "1.5rem" }}>
            {resultats.map((res, index) => (
              <div key={index} style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#22a089", display: "flex", alignItems: "center" }}>
                  <FaDiagnoses style={{ marginRight: "0.5rem" }} /> Diagnostic : {res.diagnostic || "Non disponible"}
                </h2>
                <p style={{ marginTop: "0.5rem", color: "#333" }}>
                  📖 <strong>Message :</strong> {res.message || "-"}
                </p>
                <p style={{ marginTop: "0.3rem", color: "#555" }}>
                  💡 <strong>Recommandation :</strong> {res.recommandation || "-"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormulaireAnalyses;