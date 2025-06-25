import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function InscriptionPatient() {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    date_naissance: "",
    africain: "africain", // "africain" ou "non-africain" (sera converti en booléen)
    sexe: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    // Convertit africain (texte) → africain (booléen)
    const dataToSend = {
      ...form,
      africain: form.africain === "africain", // true si "africain", false sinon
    };
    try {
      const res = await axios.post("http://localhost:8000/register", dataToSend);
      setMessage(res.data.message);
      setForm({
        nom: "",
        prenom: "",
        date_naissance: "",
        africain: "africain",
        sexe: "",
        email: "",
        password: "",
      });
    } catch (err) {
      setError(err.response?.data?.detail || "Erreur à l'inscription");
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
          Inscription 
        </h2>
        <input
          type="text"
          name="nom"
          placeholder="Nom"
          value={form.nom}
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
          type="text"
          name="prenom"
          placeholder="Prénom"
          value={form.prenom}
          onChange={handleChange}
          required
          style={{
            border: "1.2px solid #b5efe6",
            borderRadius: "7px",
            padding: "0.85rem",
            fontSize: "1rem"
          }}
        />
        <label style={{ fontSize: "1rem", color: "#18a184" }}>
          Date de naissance
        </label>
        <input
          type="date"
          name="date_naissance"
          value={form.date_naissance}
          onChange={handleChange}
          required
          style={{
            border: "1.2px solid #b5efe6",
            borderRadius: "7px",
            padding: "0.75rem",
            fontSize: "1rem"
          }}
        />
        <label style={{ fontSize: "1rem", color: "#18a184" }}>
          Origine
        </label>
        <select
          name="africain"
          value={form.africain}
          onChange={handleChange}
          required
          style={{
            border: "1.2px solid #b5efe6",
            borderRadius: "7px",
            padding: "0.75rem",
            fontSize: "1rem"
          }}
        >
          <option value="africain">Africain</option>
          <option value="non-africain">Non africain</option>
        </select>
        <label style={{ fontSize: "1rem", color: "#18a184" }}>
          Sexe
        </label>
        <div style={{ display: "flex", gap: "1.4rem", marginBottom: "0.5rem", alignItems: "center" }}>
          <label>
            <input
              type="radio"
              name="sexe"
              value="homme"
              checked={form.sexe === "homme"}
              onChange={handleChange}
              required
            /> Homme
          </label>
          <label>
            <input
              type="radio"
              name="sexe"
              value="femme"
              checked={form.sexe === "femme"}
              onChange={handleChange}
              required
            /> Femme
          </label>
        </div>
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
          S'inscrire
        </button>

        {/* Message de succès avec bouton "Se connecter" */}
        {message && (
          <div style={{ textAlign: "center", marginTop: "0.2rem" }}>
            <p style={{ color: "#18a184", fontWeight: "bold" }}>{message}</p>
            <button
              style={{
                marginTop: "0.7rem",
                padding: "0.7rem 2rem",
                background: "linear-gradient(90deg, #2BBBAD 60%, #43e97b 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "7px",
                fontSize: "1rem",
                fontWeight: "bold",
                cursor: "pointer"
              }}
              onClick={() => navigate("/login")}
            >
              Se connecter
            </button>
          </div>
        )}
        {error && <p style={{ color: "#ff3333", fontWeight: "bold", marginTop: "0.2rem" }}>{error}</p>}
      </form>
    </div>
  );
}
