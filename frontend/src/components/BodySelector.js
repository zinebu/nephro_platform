import React, { useState } from "react";
import bodyImage from "../assets/corps.jpeg"; // remplace avec ton image

export default function BodySelector({ onZoneClick }) {
  const [selectedZone, setSelectedZone] = useState(null);

  const analysesParZone = {
    coeur: ["ECG", "Troponine", "Pression artérielle"],
    reins: ["Créatinine", "Urée", "Analyse d'urine"],
    foie: ["ALAT", "ASAT", "Bilirubine"],
    poumons: ["Gaz du sang", "Radio thoracique"],
    cerveau: ["IRM", "Électroencéphalogramme"],
    estomac: ["Fibroscopie", "pH-métrie"]
  };

  const descriptions = {
    coeur: "Le cœur pompe le sang et peut être douloureux en cas de problème cardiaque.",
    reins: "Les reins filtrent le sang. Des douleurs lombaires peuvent indiquer une atteinte.",
    foie: "Le foie aide à métaboliser et éliminer les toxines. Douleurs sous les côtes ?",
    poumons: "Les poumons permettent la respiration. Difficulté à respirer ou douleur thoracique ?",
    cerveau: "Le cerveau contrôle tout le corps. Céphalées ? Perte de mémoire ?",
    estomac: "L’estomac digère les aliments. Douleurs abdominales ? Reflux ?"
  };

  const handleClick = (zone) => {
    setSelectedZone(zone);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h2>🩺 Où avez-vous mal ?</h2>

      <div style={{ position: "relative", width: "400px", margin: "1rem auto" }}>
        <img src={bodyImage} alt="Corps humain" style={{ width: "100%" }} />

        {/* Boutons zones */}
        <ZoneButton top="25%" left="45%" title="Cœur" onClick={() => handleClick("coeur")} />
        <ZoneButton top="45%" left="40%" title="Reins" onClick={() => handleClick("reins")} />
        <ZoneButton top="40%" left="42%" title="Foie" onClick={() => handleClick("foie")} />
        <ZoneButton top="20%" left="38%" title="Poumons" onClick={() => handleClick("poumons")} />
        <ZoneButton top="5%" left="44%" title="Cerveau" onClick={() => handleClick("cerveau")} />
        <ZoneButton top="38%" left="46%" title="Estomac" onClick={() => handleClick("estomac")} />
      </div>

      {/* Affichage dynamique */}
      {selectedZone && (
        <div style={{ marginTop: "2rem", animation: "fadeIn 0.5s ease-in-out" }}>
          <h3>🧠 Vous avez cliqué sur : <strong>{selectedZone.toUpperCase()}</strong></h3>
          <p>{descriptions[selectedZone]}</p>

          <h4>🔍 Analyses suggérées :</h4>
          <ul>
            {analysesParZone[selectedZone].map((analyse, idx) => (
              <li key={idx}>{analyse}</li>
            ))}
          </ul>

          <button
            style={{
              marginTop: "1rem",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
            onClick={() => onZoneClick(selectedZone)}
          >
            ✅ Analyses déjà faites
          </button>
        </div>
      )}
    </div>
  );
}

// Petit composant de zone réutilisable
function ZoneButton({ top, left, title, onClick }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        position: "absolute",
        top,
        left,
        width: "10%",
        height: "7%",
        background: "rgba(255, 0, 0, 0.3)",
        border: "none",
        cursor: "pointer"
      }}
    />
  );
}
