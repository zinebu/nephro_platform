import React from "react";

const zones = [
  { key: "reins", label: "Douleur aux reins" },
  { key: "ventre", label: "Douleur abdominale" },
  { key: "urine", label: "Troubles urinaires" },
  { key: "fatigue", label: "Fatigue générale" }
];

export default function SymptomSelector({ onSelect }) {
  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>🩻 Où ressentez-vous une douleur ?</h2>
      <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "1rem", marginTop: "2rem" }}>
        {zones.map((zone) => (
          <button
            key={zone.key}
            onClick={() => onSelect(zone.key)}
            style={{
              padding: "1rem 2rem",
              borderRadius: "1rem",
              border: "1px solid #ccc",
              background: "#f0f9ff",
              cursor: "pointer"
            }}
          >
            {zone.label}
          </button>
        ))}
      </div>
    </div>
  );
}
