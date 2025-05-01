import React from "react";

export default function Welcome({ onStart }) {
  return (
    <div style={{
      textAlign: "center",
      padding: "3rem",
      maxWidth: "600px",
      margin: "5rem auto",
      backgroundColor: "#f0f9ff",
      borderRadius: "1rem",
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
    }}>
      <h1>👋 Bienvenue !</h1>
      <p style={{ margin: "1rem 0", fontSize: "18px" }}>
        Bienvenue sur notre plateforme de prédiction rénale par IA.
        Cliquez sur "Commencer" pour lancer l’analyse.
      </p>
      <button
        onClick={onStart}
        style={{
          backgroundColor: "#2563eb",
          color: "#fff",
          padding: "0.8rem 2rem",
          borderRadius: "999px",
          border: "none",
          fontSize: "16px",
          cursor: "pointer"
        }}
      >
        Commencer
      </button>
    </div>
  );
}
