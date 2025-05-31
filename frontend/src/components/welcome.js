import React from "react";
import backgroundImg from "../assets/image.png"; // image de fond
import doctorPhoto from "../assets/au.jpg"; // image à propos
import { Link } from "react-router-dom";

export default function Welcome({ onStart }) {
  return (
    <div style={{ fontFamily: "sans-serif", backgroundColor: "#e8f5f9" }}>
      
      {/* Navbar fixe */}
      <nav style={{
        backgroundColor: "transparent",
        color: "#fff",
        padding: "1rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 1000
      }}>
        <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>NephroPlatform</div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Accueil</a>
          <Link to="/chatbot" style={{ color: "#fff", textDecoration: "none" }}>Assistant</Link>

          <a href="/app" style={{ color: "#fff", textDecoration: "none" }}>Prédiction</a>
          <a href="#apropos" style={{ color: "#fff", textDecoration: "none" }}>À propos</a>
          <a href="#contact" style={{ color: "#fff", textDecoration: "none" }}>Contact</a>
        </div>
      </nav>

      {/* Section d'accueil */}
      <section style={{
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: "cover",
        backgroundPosition: "right center",
        backgroundRepeat: "no-repeat",
        minHeight: "350px",
        display: "flex",
        alignItems: "center",
        padding: "6rem 5%",
        color: "#fff",
        position: "relative"
      }}>
        <div style={{
          flex: "1",
          maxWidth: "600px",
          padding: "2rem",
          borderRadius: "1rem",
          marginLeft: "-3%"
        }}>
          <h2 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
            Plateforme de prédiction rénale intelligente
          </h2>
          <p style={{ fontSize: "16px", marginBottom: "2rem", lineHeight: "1.6" }}>
            Grâce à notre intelligence artificielle, obtenez un diagnostic fiable basé sur vos analyses médicales et vos symptômes.
          </p>
          <button
            onClick={onStart}
            style={{
              backgroundColor: "#fff",
              color: "#2BBBAD",
              padding: "0.8rem 1.5rem",
              borderRadius: "6px",
              fontSize: "16px",
              border: "none",
              cursor: "pointer"
            }}
          >
            Commencer
          </button>
        </div>
      </section>

      {/* Fonctionnalités clés */}
      <section style={{
        padding: "4rem 2rem",
        backgroundColor: "#fff",
        textAlign: "center"
      }}>
        <h2 style={{ fontSize: "2.2rem", fontWeight: "bold", marginBottom: "1rem", color: "#000" }}>
          Fonctionnalités principales
        </h2>
        <p style={{ maxWidth: "700px", margin: "0 auto 3rem", color: "#444" }}>
          Notre outil vous guide depuis la description des symptômes jusqu'à l’analyse prédictive finale.
        </p>

        <div style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "2rem"
        }}>
          {[
            {
              title: "Chatbot médical",
              icon: "💬",
              description: "Posez vos symptômes et laissez notre assistant vous guider vers les examens adaptés."
            },
            {
              title: "Analyse par IA",
              icon: "🧠",
              description: "Prédiction fiable des maladies rénales à partir de vos résultats biologiques."
            },
            {
              title: "Suggestions d'analyses",
              icon: "🧪",
              description: "Nous vous proposons les tests médicaux les plus pertinents en fonction de vos douleurs."
            },
            {
              title: "Historique patient",
              icon: "📈",
              description: "Conservez un suivi des prédictions et comparez les diagnostics dans le temps."
            }
          ].map((item, index) => (
            <div key={index} style={{
              width: "200px",
              padding: "1.5rem",
              backgroundColor: "#f9f9f9",
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              textAlign: "center"
            }}>
              <div style={{
                fontSize: "2.5rem",
                backgroundColor: "#2BBBAD",
                borderRadius: "50%",
                width: "80px",
                height: "80px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                margin: "0 auto 1rem"
              }}>
                {item.icon}
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", marginBottom: "0.5rem" }}>
                {item.title}
              </h3>
              <p style={{ fontSize: "0.9rem", color: "#555" }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <button style={{
          marginTop: "3rem",
          padding: "0.8rem 2rem",
          backgroundColor: "#2BBBAD",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontSize: "16px",
          cursor: "pointer"
        }}>
          Commencer
        </button>
      </section>

      {/* À propos de nous */}
      <section id="apropos" style={{
        padding: "4rem 5%",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        gap: "2rem"
      }}>
        <div style={{ flex: "1 1 300px", maxWidth: "500px" }}>
          <img
            src={doctorPhoto}
            alt="À propos"
            style={{
              width: "100%",
              borderRadius: "1rem",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
          />
        </div>

        <div style={{ flex: "1 1 300px", maxWidth: "600px" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "1rem" }}>À propos de nous</h2>
          <p style={{ fontSize: "1rem", color: "#333", lineHeight: "1.6", marginBottom: "1.5rem" }}>
            NephroPlatform est développée par des ingénieurs et professionnels de santé, dans l’objectif d’aider les patients
            à mieux comprendre leurs résultats médicaux et à anticiper les maladies rénales grâce à l’IA.
          </p>
          <button style={{
            backgroundColor: "#2BBBAD",
            color: "#fff",
            padding: "0.8rem 2rem",
            border: "none",
            borderRadius: "6px",
            fontSize: "16px",
            cursor: "pointer"
          }}>
            Commencer
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" style={{
        backgroundColor: "#2BBBAD",
        color: "#fff",
        padding: "2rem 5%",
        textAlign: "center",
        marginTop: "4rem",
        borderTopLeftRadius: "1.5rem",
        borderTopRightRadius: "1.5rem"
      }}>
        <h3 style={{ marginBottom: "1rem" }}>NephroPlatform © 2025</h3>
        <p style={{ marginBottom: "0.5rem" }}>
          Plateforme intelligente d'aide au diagnostic des maladies rénales.
        </p>
        <p style={{ fontSize: "0.9rem", opacity: 0.85 }}>
          Contact : contact@nephroplatform.ai | Tous droits réservés.
        </p>
      </footer>
    </div>
  );
}
