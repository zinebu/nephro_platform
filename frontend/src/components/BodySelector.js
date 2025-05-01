import React from "react";
import bodyImage from "../assets/corps.jpeg"; // place l’image ici

export default function BodySelector({ onZoneClick }) {
  return (
    <div style={{ position: "relative", width: "400px", margin: "2rem auto" }}>
      <img src={bodyImage} alt="Corps humain" style={{ width: "100%" }} />

      {/* Exemple zone : cœur */}
      <button
        onClick={() => onZoneClick("coeur")}
        style={{
          position: "absolute",
          top: "25%", left: "45%",
          width: "10%", height: "8%",
          background: "rgba(255,0,0,0.3)",
          border: "none",
          cursor: "pointer"
        }}
        title="Cœur"
      />

      {/* Zone reins */}
      <button
        onClick={() => onZoneClick("reins")}
        style={{
          position: "absolute",
          top: "45%", left: "40%",
          width: "20%", height: "2%",
          background: "rgba(0,0,255,0.3)",
          border: "none",
          cursor: "pointer"
        }}
        title="Reins"
      />

      {/* Tu peux ajouter autant de zones que tu veux */}
    </div>
  );
}
