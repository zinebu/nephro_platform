import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ConnexionPatient() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/login", { 
        email: form.email, 
        password: form.password 
      });
      if (res.data.success) {
        // On stocke l'email (important pour la prédiction)
        localStorage.setItem("email", form.email);  // <-- C'est ça qu'il faut absolument !
        // Optionnel: nom et prénom pour le menu d'accueil
        localStorage.setItem("nom", res.data.nom || "");
        localStorage.setItem("prenom", res.data.prenom || "");
        navigate("/menu"); // Ou "/predict" si tu vas direct à la prédiction
      } else {
        setError(res.data.message || "Erreur");
      }
    } catch (err) {
      setError("Erreur de connexion");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(120deg,#2BBBAD,#43e97b 85%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <form onSubmit={handleSubmit} style={{
        background: "#fff",
        borderRadius: "1.5rem",
        boxShadow: "0 4px 24px rgba(43,187,173,0.09)",
        padding: "2.5rem 2.5rem 2rem 2.5rem",
        width: "370px",
        display: "flex",
        flexDirection: "column",
        gap: "1.15rem"
      }}>
        <h2 style={{
          textAlign: "center",
          color: "#2BBBAD",
          marginBottom: "0.5rem"
        }}>
          Connexion 
        </h2>
        <input
          type="email"
          name="email"
          placeholder="Adresse e-mail"
          value={form.email}
          onChange={handleChange}
          required
          style={{
            border: "1.2px solid #b5efe6",
            borderRadius: "7px",
            padding: "0.85rem",
            fontSize: "1rem"
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={form.password}
          onChange={handleChange}
          required
          style={{
            border: "1.2px solid #b5efe6",
            borderRadius: "7px",
            padding: "0.85rem",
            fontSize: "1rem"
          }}
        />
        <button
          type="submit"
          style={{
            background: "linear-gradient(90deg, #2BBBAD 60%, #43e97b 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "7px",
            padding: "0.95rem",
            fontSize: "1.18rem",
            fontWeight: "bold",
            marginTop: "0.6rem",
            cursor: "pointer"
          }}>
          Se connecter
        </button>
        <div style={{ textAlign: "center", marginTop: "1rem", color: "#333" }}>
          Pas de compte ?{" "}
          <span
            style={{ color: "#2BBBAD", cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/inscription")}
          >
            Créer un compte
          </span>
        </div>
        {message && <p style={{ color: "#18a184", fontWeight: "bold", marginTop: "0.2rem" }}>{message}</p>}
        {error && <p style={{ color: "#ff3333", fontWeight: "bold", marginTop: "0.2rem" }}>{error}</p>}
      </form>
    </div>
  );
}
