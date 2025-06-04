import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import welcomeImage from "../assets/cnx.png"; // Assure-toi que ce fichier existe bien

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "signup" && password !== confirm) {
      setError("Les mots de passe ne correspondent pas !");
      return;
    }

    const endpoint = mode === "login" ? "/login" : "/signup";

    try {
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.detail || "Erreur.");
      } else {
        setError("");
        navigate("/menu");
      }
    } catch {
      setError("Erreur de connexion au serveur.");
    }
  };

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', sans-serif",
      backgroundColor: "#f0f9f8"
    }}>
      
      {/* Colonne gauche avec image élargie */}
      <div style={{
        flex: 1.6,
        backgroundImage: `url(${welcomeImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderTopLeftRadius: "16px",
        borderBottomLeftRadius: "16px"
      }} />

      {/* Colonne droite avec formulaire */}
      <div style={{
        flex: 0.9,
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem"
      }}>
        <form onSubmit={handleSubmit} style={{
          width: "100%",
          maxWidth: "370px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          padding: "2rem",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.08)"
        }}>
          <h2 style={{ textAlign: "center", color: "#2BBBAD", marginBottom: "1.5rem" }}>
            {mode === "login" ? "Connexion" : "Créer un compte"}
          </h2>
          <input type="email" placeholder="Adresse e-mail" value={email}
            onChange={e => setEmail(e.target.value)} required style={inputStyle} />
          <input type="password" placeholder="Mot de passe" value={password}
            onChange={e => setPassword(e.target.value)} required style={inputStyle} />
          {mode === "signup" && (
            <input type="password" placeholder="Confirmer le mot de passe" value={confirm}
              onChange={e => setConfirm(e.target.value)} required style={inputStyle} />
          )}
          {error && <p style={{ color: "#d63031", fontSize: "0.95rem", marginTop: "-0.6rem" }}>{error}</p>}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem", fontSize: "0.9rem" }}>
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Se souvenir de moi</label>
          </div>
          <button type="submit" style={buttonStyle}>
            {mode === "login" ? "Se connecter" : "S'inscrire"}
          </button>
          <div style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.95rem" }}>
            {mode === "login" ? (
              <>Pas encore inscrit ? <span onClick={() => { setMode("signup"); setError(""); }} style={linkStyle}>Créer un compte</span></>
            ) : (
              <>Déjà inscrit ? <span onClick={() => { setMode("login"); setError(""); }} style={linkStyle}>Se connecter</span></>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

const inputStyle = {
  border: "1px solid #ccc",
  borderRadius: "8px",
  padding: "0.9rem",
  fontSize: "1rem",
  marginBottom: "1.2rem",
  width: "100%",
  background: "#f7f9fa"
};

const buttonStyle = {
  backgroundColor: "#2BBBAD",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  padding: "0.9rem",
  fontSize: "1rem",
  fontWeight: "bold",
  cursor: "pointer",
  width: "100%"
};

const linkStyle = {
  color: "#2BBBAD",
  cursor: "pointer",
  fontWeight: "500",
  textDecoration: "underline"
};
