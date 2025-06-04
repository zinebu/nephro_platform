import React, { useState } from "react";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // "login" ou "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici tu ajoutes la logique d'appel backend
    if (mode === "signup" && password !== confirm) {
      setError("Les mots de passe ne correspondent pas !");
      return;
    }
    setError("");
    alert("Authentification simulée (connecte ça à ton backend bientôt) !");
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(120deg,#2BBBAD,#43e97b 85%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <form onSubmit={handleSubmit}
        style={{
          background: "#fff",
          borderRadius: "1.5rem",
          boxShadow: "0 4px 24px rgba(43,187,173,0.09)",
          padding: "2.5rem 2.5rem 2rem 2.5rem",
          width: "350px",
          display: "flex",
          flexDirection: "column",
          gap: "1.2rem"
        }}>
        <h2 style={{ textAlign: "center", color: "#2BBBAD", marginBottom: "0.7rem" }}>
          {mode === "login" ? "Connexion" : "Créer un compte"}
        </h2>
        <input
          type="email"
          placeholder="Adresse e-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            border: "1.2px solid #b5efe6",
            borderRadius: "7px",
            padding: "0.9rem",
            fontSize: "1rem"
          }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{
            border: "1.2px solid #b5efe6",
            borderRadius: "7px",
            padding: "0.9rem",
            fontSize: "1rem"
          }}
        />
        {mode === "signup" && (
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            style={{
              border: "1.2px solid #b5efe6",
              borderRadius: "7px",
              padding: "0.9rem",
              fontSize: "1rem"
            }}
          />
        )}
        {error && <p style={{ color: "#ff3333", fontSize: "1rem", marginTop: "-8px" }}>{error}</p>}
        <button
          type="submit"
          style={{
            background: "linear-gradient(90deg, #2BBBAD 60%, #43e97b 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "7px",
            padding: "0.9rem",
            fontSize: "1.13rem",
            fontWeight: "bold",
            marginTop: "0.6rem",
            cursor: "pointer"
          }}>
          {mode === "login" ? "Se connecter" : "S'inscrire"}
        </button>
        <div style={{ textAlign: "center", marginTop: "1rem", color: "#333" }}>
          {mode === "login" ?
            <>
              Pas de compte ?{" "}
              <span
                style={{ color: "#2BBBAD", cursor: "pointer", textDecoration: "underline" }}
                onClick={() => { setMode("signup"); setError(""); }}
              >Créer un compte</span>
            </>
            :
            <>
              Déjà inscrit ?{" "}
              <span
                style={{ color: "#2BBBAD", cursor: "pointer", textDecoration: "underline" }}
                onClick={() => { setMode("login"); setError(""); }}
              >Connexion</span>
            </>
          }
        </div>
      </form>
    </div>
  );
}
