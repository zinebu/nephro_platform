import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

export default function PatientHistory() {
  const [history, setHistory] = useState([]);
  const [expandedDate, setExpandedDate] = useState(null);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("email");

    if (!email) {
      alert("Email introuvable. Veuillez vous reconnecter.");
      return;
    }

    fetch(`http://localhost:8000/historique/${email}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(res => {
        if (!res.ok) throw new Error("Erreur HTTP: " + res.status);
        return res.json();
      })
      .then(data => {
        console.log("Historique reçu :", data);
        setHistory(data);
      })
      .catch(err => {
        console.error("Erreur historique:", err);
        alert("Impossible de récupérer l'historique.");
      });
  }, []);

  const groupedByDate = history.reduce((acc, item) => {
    const date = new Date(item.date).toLocaleDateString();
    acc[date] = acc[date] || [];
    acc[date].push(item);
    return acc;
  }, {});

  const diagnosticData = Object.values(
    history.reduce((acc, item) => {
      acc[item.diagnostic] = acc[item.diagnostic] || {
        name: item.diagnostic,
        value: 0
      };
      acc[item.diagnostic].value += 1;
      return acc;
    }, {})
  );

  const tgfData = history.map((item, index) => ({
    name: `#${index + 1}`,
    TGF: item.tgf
  }));

  const COLORS = ["#2BBBAD", "#43e97b", "#FFBB28", "#FF8042", "#aa47bc", "#66bb6a"];

  return (
    <div style={{ fontFamily: "sans-serif", backgroundColor: "#e8f5f9", minHeight: "100vh" }}>
      <nav style={{
        backgroundImage: "linear-gradient(90deg, #2BBBAD 45%, #43e97b 100%)",
        color: "#fff",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        borderTopLeftRadius: "2rem",
        borderTopRightRadius: "2rem",
        margin: "0 auto",
        width: "calc(100% - 4rem)"
      }}>
        <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>Renalys</div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Accueil</Link>
          <Link to="/predict" style={{ color: "#fff", textDecoration: "none" }}>Prédiction</Link>
          <Link to="/assistant" style={{ color: "#fff", textDecoration: "none" }}>Assistant</Link>
          <span style={{ color: "#fff", fontWeight: "bold", cursor: "default" }}>Historique</span>
          <Link to="/login" style={{ color: "#fff", textDecoration: "none" }}>Déconnexion</Link>
        </div>
      </nav>

      <section style={{ padding: "7rem 2rem 3rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "2.5rem", color: "#22a089", marginBottom: "1rem" }}>Historique des prédictions</h2>
        <p style={{ color: "#555", marginBottom: "2rem" }}>Cliquez sur une date pour voir les détails classés par diagnostic.</p>

        {Object.keys(groupedByDate).length === 0 ? (
          <p style={{ fontSize: "1rem", color: "#888" }}>Aucune prédiction enregistrée pour le moment.</p>
        ) : (
          <>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "1rem",
              marginBottom: "3rem"
            }}>
              {Object.keys(groupedByDate).map((date, idx) => (
                <div key={idx} style={{
                  backgroundColor: "#fff",
                  padding: "1rem 1.5rem",
                  borderRadius: "1rem",
                  width: "300px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                  onClick={() => setExpandedDate(expandedDate === date ? null : date)}>
                  <p style={{ fontWeight: "bold", color: "#2BBBAD" }}>📅 {date}</p>
                  {expandedDate === date && (
                    <>
                      {Object.entries(groupedByDate[date].reduce((acc, item) => {
                        acc[item.diagnostic] = acc[item.diagnostic] || [];
                        acc[item.diagnostic].push(item);
                        return acc;
                      }, {})).map(([diagnostic, items], i) => (
                        <div key={i} style={{ marginTop: "0.5rem", textAlign: "left", background: "#f6fefe", padding: "0.5rem", borderRadius: "0.5rem" }}>
                          <p style={{ fontWeight: "bold", color: "#22a089" }}>{diagnostic}</p>
                          {items.map((item, j) => (
                            <div key={j} style={{ paddingLeft: "1rem", borderLeft: "3px solid #2BBBAD", marginBottom: "0.5rem" }}>
                              <p><strong>Heure :</strong> {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                              <p><strong>TGF :</strong> {item.tgf}</p>
                              <p><strong>Message :</strong> {item.message}</p>
                              <p><strong>Recommandation :</strong> {item.recommandation}</p>
                            </div>
                          ))}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              ))}
            </div>

            <div style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "2rem",
              marginBottom: "3rem"
            }}>
              <div style={{
                backgroundColor: "#fff",
                padding: "1.5rem",
                borderRadius: "1rem",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                width: "400px"
              }}>
                <h3 style={{ color: "#2BBBAD", marginBottom: "1rem" }}>Répartition des diagnostics</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={diagnosticData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {diagnosticData.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{
                backgroundColor: "#fff",
                padding: "1.5rem",
                borderRadius: "1rem",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                width: "500px"
              }}>
                <h3 style={{ color: "#2BBBAD", marginBottom: "1rem" }}>Évolution du TGF</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={tgfData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="TGF" stroke="#43e97b" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}

        <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
          <Link to="/predict" style={{
            background: "#43e97b",
            color: "#fff",
            padding: "0.8rem 1.6rem",
            borderRadius: "8px",
            fontSize: "1rem",
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            Faire une nouvelle prédiction
          </Link>

          <Link to="/" style={{
            background: "#2BBBAD",
            color: "#fff",
            padding: "0.8rem 1.6rem",
            borderRadius: "8px",
            fontSize: "1rem",
            textDecoration: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
          }}>
            Retour à l'accueil
          </Link>

          <button
            onClick={() => setShowMap(!showMap)}
            style={{
              background: "#ff7043",
              color: "#fff",
              padding: "0.8rem 1.6rem",
              borderRadius: "8px",
              fontSize: "1rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}
          >
            {showMap ? "Masquer la carte" : "Trouver un médecin"}
          </button>
        </div>

        {showMap && (
          <div style={{ marginTop: "2rem", display: "flex", justifyContent: "center" }}>
            <iframe
              title="Médecins néphrologie Oujda"
              src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d52501.62322902259!2d-1.9318163994818278!3d34.67107836148947!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1snephrologie!5e0!3m2!1sfr!2sma!4v1750855974189!5m2!1sfr!2sma"
              width="100%"
              height="450"
              style={{ border: 0, borderRadius: "1rem", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        )}
      </section>
    </div>
  );
}
