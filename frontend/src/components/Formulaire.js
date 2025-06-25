import React, { useState } from "react";
import axios from "axios";
import { FaFlask, FaDiagnoses } from "react-icons/fa";
import { Link } from "react-router-dom";

// Analyses catégorielles et leurs options possibles
const ANALYSE_OPTIONS = {
  rbc: ["normal", "abnormal"],
  pc: ["normal", "abnormal"],
  pcc: ["present", "notpresent"],
  ba: ["present", "notpresent"],
  htn: ["yes", "no"],
  dm: ["yes", "no"],
  cad: ["yes", "no"],
  appet: ["good", "poor"],
  pe: ["yes", "no"],
  ane: ["yes", "no"],
};

// Labels lisibles
const ANALYSE_LABELS = {
  bp: "Pression artérielle (bp)",
  sg: "Densité urinaire (sg)",
  al: "Protéinurie (al)",
  su: "Sucre urinaire (su)",
  bgr: "Glycémie (bgr)",
  bu: "Urée sanguine (bu)",
  sc: "Créatinine sérique (sc)",
  sod: "Sodium (sod)",
  pot: "Potassium (pot)",
  hemo: "Hémoglobine (hemo)",
  pcv: "Volume globulaire (pcv)",
  wc: "Leucocytes (wc)",
  rc: "Érythrocytes (rc)",
  htn: "Hypertension (htn)",
  dm: "Diabète (dm)",
  cad: "Cardiopathie (cad)",
  appet: "Appétit (appet)",
  pe: "Œdème (pe)",
  ane: "Anémie (ane)",
  rbc: "Globules rouges urinaires (rbc)",
  pc: "Cylindres urinaires (pc)",
  pcc: "Cellules épithéliales (pcc)",
  ba: "Bactéries urinaires (ba)"
};

const groupedAnalyses = [
  { title: "Paramètres de base", analyses: ["bp", "sg", "al", "su"] },
  { title: "Biochimie", analyses: ["bgr", "bu", "sc", "sod", "pot"] },
  { title: "Sang", analyses: ["hemo", "pcv", "wc", "rc"] },
  { title: "Conditions cliniques", analyses: ["htn", "dm", "cad", "appet", "pe", "ane"] },
  { title: "Urinaire", analyses: ["rbc", "pc", "pcc", "ba"] }
];

const FormulaireAnalyses = () => {
  const [formData, setFormData] = useState({});
  const [resultats, setResultats] = useState(null);
  const [tgf, setTgf] = useState(null);
  const [error, setError] = useState("");

  // Récupère l'email du patient (déjà connecté) depuis localStorage
  const email = localStorage.getItem("email");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) {
      setError("Veuillez d'abord vous connecter.");
      return;
    }
    try {
      const response = await axios.post("http://127.0.0.1:8000/predict", {
        email,
        analyses: formData, // C'est la clé attendue par le backend
      });
      setTgf(response.data.tgf || null);
      setResultats(response.data.diagnostics || []);
    } catch (error) {
      setResultats(null);
      setTgf(null);
      setError("Échec de la prédiction, vérifiez les données.");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom right, #e8f5f9, #f7fcff)", paddingTop: "6rem", padding: "3rem 1rem" }}>
      {/* Navbar */}
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
        <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>NephroPlatform</div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Accueil</Link>
          <span style={{ color: "#fff", fontWeight: "bold", cursor: "default" }}>Prédiction</span>
          <Link to="/assistant" style={{ color: "#fff", textDecoration: "none" }}>Assistant</Link>
          <Link to="/historique" style={{ color: "#fff", textDecoration: "none" }}>Historique</Link>
          <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>Déconnexion</Link>
        </div>
      </nav>

      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        background: "#fff",
        borderRadius: "2rem",
        padding: "3rem",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
      }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#2BBBAD", marginBottom: "1.5rem" }}>
          Analyse Médicale Personnalisée
        </h1>
        <p style={{ color: "#465661", fontSize: "1.125rem", marginBottom: "2rem" }}>
          Saisissez les résultats de vos analyses pour obtenir un diagnostic prédictif basé sur l’intelligence artificielle.
        </p>

        <form onSubmit={handleSubmit}>
          {groupedAnalyses.map((group, i) => (
            <div key={i} style={{
              marginBottom: "2rem",
              padding: "1.5rem",
              backgroundColor: "#f9fcfc",
              borderRadius: "1rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
            }}>
              <h2 style={{ color: "#22a089", fontWeight: "bold", marginBottom: "1rem" }}>{group.title}</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {group.analyses.map((analyse) => (
                  <div key={analyse} style={{ display: "flex", flexDirection: "column" }}>
                    <label style={{ fontWeight: 600, color: "#465661", marginBottom: "0.5rem" }}>
                      {ANALYSE_LABELS[analyse] || analyse}
                    </label>
                    {ANALYSE_OPTIONS[analyse] ? (
                      <select
                        name={analyse}
                        value={formData[analyse] || ""}
                        onChange={handleChange}
                        style={{
                          border: "1px solid #ccd",
                          borderRadius: "1rem",
                          padding: "0.6rem 1rem",
                          fontSize: "1rem"
                        }}
                      >
                        <option value="">--Sélectionnez--</option>
                        {ANALYSE_OPTIONS[analyse].map(opt => (
                          <option key={opt} value={opt}>
                            {opt.charAt(0).toUpperCase() + opt.slice(1)}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        name={analyse}
                        value={formData[analyse] || ""}
                        onChange={handleChange}
                        style={{
                          border: "1px solid #ccd",
                          borderRadius: "1rem",
                          padding: "0.6rem 1rem",
                          outline: "none",
                          transition: "0.3s",
                          fontSize: "1rem"
                        }}
                        placeholder={`Entrer la valeur de ${ANALYSE_LABELS[analyse] || analyse}`}
                      />
                    )}
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
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)"
              }}
            >
              <FaFlask style={{ marginRight: "0.5rem" }} /> Lancer la prédiction
            </button>
          </div>
        </form>

        {tgf && (
          <div style={{ marginTop: "2rem", padding: "1rem", background: "#f0faf8", borderRadius: "1rem", textAlign: "center", color: "#333", fontWeight: "bold" }}>
            Taux de Filtration Glomérulaire (TGF) estimé : {tgf}
          </div>
        )}

        {resultats && Array.isArray(resultats) && (
          <div style={{ marginTop: "2rem", background: "#f0faf8", borderLeft: "4px solid #2BBBAD", borderRadius: "1rem", padding: "1.5rem" }}>
            {resultats.map((res, index) => (
              <div key={index} style={{ marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#22a089", display: "flex", alignItems: "center" }}>
                  <FaDiagnoses style={{ marginRight: "0.5rem" }} /> Diagnostic : {res.diagnostic || "Non disponible"}
                </h2>
                <p style={{ marginTop: "0.5rem", color: "#333" }}>
                  <strong>Message :</strong> {res.message || "-"}
                </p>
                <p style={{ marginTop: "0.3rem", color: "#555" }}>
                  <strong>Recommandation :</strong> {res.recommandation || "-"}
                </p>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div style={{ marginTop: "1.5rem", color: "red", textAlign: "center", fontWeight: "bold" }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormulaireAnalyses;
