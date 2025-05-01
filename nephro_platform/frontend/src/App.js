// frontend/src/App.jsx
import React, { useState } from "react";
import axios from "axios";

const analysesDisponibles = [
  { key: "age", label: "Âge" },
  { key: "bp", label: "Pression artérielle (BP)" },
  { key: "sg", label: "Gravité spécifique (SG)" },
  { key: "al", label: "Albumine (AL)" },
  { key: "su", label: "Sucre (SU)" },
  { key: "rbc", label: "Globules rouges (RBC)", type: "select", options: ["normal", "abnormal"] },
  { key: "pc", label: "Cellules pyuriques (PC)", type: "select", options: ["normal", "abnormal"] },
  { key: "pcc", label: "Cellules cylindriques (PCC)", type: "select", options: ["present", "notpresent"] },
  { key: "ba", label: "Bactéries (BA)", type: "select", options: ["present", "notpresent"] },
  { key: "bgr", label: "Glycémie (BGR)" },
  { key: "bu", label: "Urée sanguine (BU)" },
  { key: "sc", label: "Créatinine sérique (SC)" },
  { key: "sod", label: "Sodium (SOD)" },
  { key: "pot", label: "Potassium (POT)" },
  { key: "hemo", label: "Hémoglobine (HEMO)" },
  { key: "pcv", label: "Volume globulaire (PCV)" },
  { key: "wc", label: "Globules blancs (WC)" },
  { key: "rc", label: "Globules rouges (RC)" },
  { key: "htn", label: "Hypertension (HTN)", type: "select", options: ["yes", "no"] },
  { key: "dm", label: "Diabète (DM)", type: "select", options: ["yes", "no"] },
  { key: "cad", label: "Cardiopathie (CAD)", type: "select", options: ["yes", "no"] },
  { key: "appet", label: "Appétit", type: "select", options: ["good", "poor"] },
  { key: "pe", label: "Œdème (PE)", type: "select", options: ["yes", "no"] },
  { key: "ane", label: "Anémie (ANE)", type: "select", options: ["yes", "no"] }
];

export default function App() {
  const [selected, setSelected] = useState([]);
  const [values, setValues] = useState({});
  const [result, setResult] = useState(null);

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
  console.log("🟢 Formulaire soumis !");
  
    const data = {};
    selected.forEach((k) => {
      if (values[k] !== undefined && values[k] !== "") {
        data[k] = isNaN(values[k]) ? values[k] : parseFloat(values[k]);
      }
    });
  
    console.log("📤 Envoi au backend :", data); // <--- Ajoute ce log !
  
    try {
      const res = await axios.post("http://127.0.0.1:8000/predict", { data });
      console.log("✅ Réponse backend :", res.data); // <--- Important pour debug
      setResult(res.data);
    } catch (err) {
      console.error("❌ Erreur axios :", err);
      setResult({ diagnostic: "❌ Erreur de connexion au backend.", proba: null });
    }
  };
  

  const getRiskColor = (proba) => {
    if (proba < 33) return "text-green-700";
    if (proba < 66) return "text-yellow-700";
    return "text-red-700";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Plateforme de Prédiction Néphrologique</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <p className="font-semibold">Sélectionnez les analyses que vous avez réalisées :</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {analysesDisponibles.map(({ key, label }) => (
            <label key={key} className="flex items-center">
              <input
                type="checkbox"
                checked={selected.includes(key)}
                onChange={() => handleToggle(key)}
                className="mr-2"
              />
              {label}
            </label>
          ))}
        </div>

        {selected.length > 0 && (
          <div className="mt-6 space-y-4">
            <p className="font-semibold">Veuillez entrer les valeurs des analyses sélectionnées :</p>
            {selected.map((key) => {
              const item = analysesDisponibles.find((a) => a.key === key);
              return (
                <div key={key}>
                  <label className="block font-medium mb-1">{item.label}</label>
                  {item.type === "select" ? (
                    <select
                      className="border p-2 w-full"
                      value={values[key] || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                    >
                      <option value="">-- Choisir --</option>
                      {item.options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="number"
                      step="any"
                      className="border p-2 w-full"
                      value={values[key] || ""}
                      onChange={(e) => handleChange(key, e.target.value)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
          Prédire
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <strong className="block">🧠 Résultat :</strong>
          {result.proba !== null ? (
            <div className={getRiskColor(result.proba)}>
              {result.diagnostic}
            </div>
          ) : (
            <div>{result.diagnostic}</div>
          )}
        </div>
      )}
    </div>
  );
}
