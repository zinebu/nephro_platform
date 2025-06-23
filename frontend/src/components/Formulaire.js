import React, { useState } from "react";
import axios from "axios";
import Welcome from "./welcome";
import BodySelector from "./BodySelector";

const analysesDisponibles = [
  { key: "age", label: "Âge", category: "Informations générales" },
  { key: "bp", label: "Pression artérielle (BP)", category: "Informations générales" },
  { key: "sg", label: "Gravité spécifique (SG)", category: "Analyses urinaires" },
  { key: "al", label: "Albumine (AL)", category: "Analyses urinaires" },
  { key: "su", label: "Sucre (SU)", category: "Analyses urinaires" },
  { key: "bgr", label: "Glycémie (BGR)", category: "Analyses sanguines" },
  { key: "bu", label: "Urée sanguine (BU)", category: "Analyses sanguines" },
  { key: "sc", label: "Créatinine sérique (SC)", category: "Analyses sanguines" },
  { key: "sod", label: "Sodium sanguin (SOD)", category: "Électrolytes" },
  { key: "pot", label: "Potassium sanguin (POT)", category: "Électrolytes" },
  { key: "hemo", label: "Hémoglobine (HEMO)", category: "Hématologie" },
  { key: "pcv", label: "Volume globulaire moyen (PCV)", category: "Hématologie" },
  { key: "wc", label: "Globules blancs (WC)", category: "Hématologie" },
  { key: "rc", label: "Globules rouges (RC)", category: "Hématologie" },
  { key: "htn", label: "Hypertension (HTN)", type: "select", options: ["yes", "no"], category: "Antécédents médicaux" },
  { key: "dm", label: "Diabète (DM)", type: "select", options: ["yes", "no"], category: "Antécédents médicaux" },
  { key: "cad", label: "Maladie coronarienne (CAD)", type: "select", options: ["yes", "no"], category: "Antécédents médicaux" },
  { key: "appet", label: "Appétit", type: "select", options: ["good", "poor"], category: "État clinique actuel" },
  { key: "pe", label: "Œdèmes (PE)", type: "select", options: ["yes", "no"], category: "État clinique actuel" },
  { key: "ane", label: "Anémie (ANE)", type: "select", options: ["yes", "no"], category: "État clinique actuel" },
  { key: "rbc", label: "Globules rouges dans les urines (RBC)", type: "select", options: ["normal", "abnormal"], category: "Analyses urinaires" },
  { key: "pc", label: "Globules blancs dans les urines (PC)", type: "select", options: ["normal", "abnormal"], category: "Analyses urinaires" },
  { key: "pcc", label: "Cylindres urinaires (PCC)", type: "select", options: ["present", "notpresent"], category: "Analyses urinaires" },
  { key: "ba", label: "Bactéries urinaires (BA)", type: "select", options: ["present", "notpresent"], category: "Analyses urinaires" }
];


export default function Formulaire() {
  const [step, setStep] = useState("form");
  const [selected, setSelected] = useState([]);
  const [values, setValues] = useState({});
  const [diagnostic, setDiagnostic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [openCategories, setOpenCategories] = useState({});

  const handleToggle = (key) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleChange = (key, value) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {};
    selected.forEach((k) => {
      if (values[k] !== undefined && values[k] !== "") {
        data[k] = isNaN(values[k]) ? values[k] : parseFloat(values[k]);
      }
    });
    setLoading(true);
    setDiagnostic(null);
    try {
      const res = await axios.post("http://localhost:8000/predict", { data });
      setDiagnostic(res.data);
    } catch (err) {
      console.error("Erreur axios :", err);
      setDiagnostic("Erreur lors de la prédiction");
    } finally {
      setLoading(false);
    }
  };

  const grouped = analysesDisponibles.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const toggleCategory = (category) => {
    setOpenCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  if (step === "welcome") {
    return <Welcome onStart={() => setStep("assistant")} />;
  }

  if (step === "assistant") {
    return <BodySelector onDone={() => setStep("form")} />;
  }

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1><span role="img" aria-label="stéthoscope">🩺</span> Plateforme de diagnostic rénal par IA</h1>

      <form onSubmit={handleSubmit}>
        {Object.entries(grouped).map(([category, items]) => (
          <div key={category} style={{ marginBottom: "1rem" }}>
            <div
              onClick={() => toggleCategory(category)}
              style={{ cursor: "pointer", background: "#e0f2fe", padding: "0.5rem" }}
            >
              <strong>{openCategories[category] ? "▼" : "▶"} {category}</strong>
            </div>

            {openCategories[category] &&
              items.map(({ key, label, type, options }) => (
                <div key={key} style={{ paddingLeft: "1rem", marginTop: "0.5rem" }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selected.includes(key)}
                      onChange={() => handleToggle(key)}
                    /> {label}
                  </label>

                  {selected.includes(key) && (
                    <>
                      <br />
                      {type === "select" ? (
                        <select
                          value={values[key] || ""}
                          onChange={(e) => handleChange(key, e.target.value)}
                        >
                          <option value="">-- Choisir --</option>
                          {options.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="number"
                          step="any"
                          value={values[key] || ""}
                          onChange={(e) => handleChange(key, e.target.value)}
                        />
                      )}
                    </>
                  )}
                </div>
              ))}
          </div>
        ))}

        <button type="submit" style={{ marginTop: "1rem" }}>
          Obtenir un diagnostic
        </button>
      </form>

      {loading && <p><span role="img" aria-label="loupe">🔍</span> Analyse en cours...</p>}

      {diagnostic && (
        <div style={{ marginTop: "1rem", background: "#f0fdf4", padding: "1rem", borderRadius: "6px" }}>
          <p><strong><span role="img" aria-label="cerveau">🧠</span> Diagnostic :</strong> {diagnostic.diagnostic}</p>
          <p><strong><span role="img" aria-label="livre">📖</span> Explication :</strong> {diagnostic.explication}</p>
          <p><strong><span role="img" aria-label="recommandation">🩺</span> Recommandation :</strong> {diagnostic.recommandation}</p>
        </div>
      )}
    </div>
  );
}
