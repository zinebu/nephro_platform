import React from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import assistantLottie from "../assets/doctor-lottie.json";
import predictLottie from "../assets/predict-lottie.json";
import historyLottie from "../assets/history-lottie.json";

const HomeMenu = () => {
  const navigate = useNavigate();

  // Récupérer nom et prénom depuis localStorage
  const nom = localStorage.getItem("nom") || "";
  const prenom = localStorage.getItem("prenom") || "";

  // Optionnel : choisir "Mr" ou "Mme" selon le sexe si tu le stockes aussi
  const sexe = localStorage.getItem("sexe"); // à stocker lors du login ou inscription
 const civilite = sexe === "femme" ? "Mme" : "Mr";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #2BBBAD 0%, #43e97b 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "2rem",
          boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
          padding: "3rem 2.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minWidth: 340
        }}
      >
        {/* Message de bienvenue */}
        <h2 style={{ color: "#17b978", fontWeight: "bold", marginBottom: 18, fontSize: 26, letterSpacing: "0.5px" }}>
          {nom && prenom 
            ? <>Bienvenue <span style={{ color: "#2BBBAD" }}> {nom} {prenom} </span> !</>
            : <>Bienvenue sur la plateforme !</>
          }
        </h2>

        <h1 style={{ color: "#2BBBAD", fontWeight: "bold", marginBottom: 32, fontSize: 28 }}>
          Que voulez-vous faire ?
        </h1>

        {/* Menu avec Lottie à gauche de chaque bouton */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
          {/* Assistant */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Lottie animationData={assistantLottie} loop={true} style={{ width: 100, height: 100 }} />
            <button
              style={{
                background: "#2BBBAD",
                color: "#fff",
                border: "none",
                borderRadius: "1.5rem",
                padding: "1rem 2.5rem",
                fontSize: 18,
                cursor: "pointer",
                fontWeight: "bold",
                width: "100%"
              }}
              onClick={() => navigate("/assistant")}
            >
              Utiliser l’assistant
            </button>
          </div>
          {/* Prédiction */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Lottie animationData={predictLottie} loop={true} style={{ width: 100, height: 100 }} />
            <button
              style={{
                background: "#43e97b",
                color: "#fff",
                border: "none",
                borderRadius: "1.5rem",
                padding: "1rem 2.5rem",
                fontSize: 18,
                cursor: "pointer",
                fontWeight: "bold",
                width: "100%"
              }}
              onClick={() => navigate("/predict")}
            >
              Faire une prédiction
            </button>
          </div>
          {/* Historique */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Lottie animationData={historyLottie} loop={true} style={{ width: 100, height: 100 }} />
            <button
              style={{
                background: "#17b978",
                color: "#fff",
                border: "none",
                borderRadius: "1.5rem",
                padding: "1rem 2.5rem",
                fontSize: 18,
                cursor: "pointer",
                fontWeight: "bold",
                width: "100%"
              }}
              onClick={() => navigate("/historique")}
            >
              Voir l’historique
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeMenu;
