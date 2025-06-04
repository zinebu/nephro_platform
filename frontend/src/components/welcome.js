import React from "react";
import backgroundImg from "../assets/image.png";
import doctorPhoto from "../assets/au.jpg";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import DoctorLottie from "../assets/doctor-lottie.json";
import AiLottie from "../assets/predict-lottie.json";
import AnalyzeLottie from "../assets/analyze-lottie.json";
import HistoryLottie from "../assets/history-lottie.json";

const services = [
  {
    title: "Chatbot médical",
    lottie: DoctorLottie,
    description: "Posez vos symptômes et laissez notre assistant vous guider vers les examens adaptés."
  },
  {
    title: "Analyse par IA",
    lottie: AiLottie,
    description: "Prédiction fiable des maladies rénales à partir de vos résultats biologiques."
  },
  {
    title: "Suggestions d'analyses",
    lottie: AnalyzeLottie,
    description: "Nous vous proposons les tests médicaux les plus pertinents en fonction de vos douleurs."
  },
  {
    title: "Historique patient",
    lottie: HistoryLottie,
    description: "Conservez un suivi des prédictions et comparez les diagnostics dans le temps."
  }
];

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "sans-serif", backgroundColor: "#e8f5f9" }}>
      {/* Navbar */}
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
        zIndex: 1000,
        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)"
      }}>
        <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>NephroPlatform</div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          <a href="#" style={{ color: "#fff", textDecoration: "none" }}>Accueil</a>
          <a href="#services" style={{ color: "#fff", textDecoration: "none" }}>Services</a>
          <a href="#apropos" style={{ color: "#fff", textDecoration: "none" }}>À propos</a>
          <a href="/connexion" style={{ color: "#fff", textDecoration: "none" }}>Connexion</a>
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
            onClick={() => navigate("/menu")}
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
      <section id="services" style={{
        padding: "4rem 2rem",
        backgroundColor: "#fff",
        textAlign: "center"
      }}>
        <h2 style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: "1.2rem",
          color: "#222",
          letterSpacing: "-2px"
        }}>
          Nos services
        </h2>
        <p style={{
          maxWidth: "700px",
          margin: "0 auto 3rem",
          color: "#444",
          fontSize: "1.13rem"
        }}>
          Notre outil vous guide depuis la description des symptômes jusqu'à l’analyse prédictive finale.
        </p>

        <div style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "2rem",
          marginBottom: "2.5rem"
        }}>
          {services.map((item, index) => (
            <div
              key={index}
              style={{
                width: "270px",
                background: "#fafcff",
                borderRadius: "1.5rem",
                boxShadow: "0 2px 24px rgba(43,187,173,0.08), 0 1.5px 6px rgba(43,187,173,0.08)",
                padding: "2rem 1.5rem 1.6rem 1.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                transition: "all 0.24s cubic-bezier(.28,.45,.59,.93)",
                cursor: "pointer",
                border: "1.5px solid #e6f7f1"
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = "0 6px 32px 0 rgba(43,187,173,0.14)";
                e.currentTarget.style.transform = "scale(1.045)";
                e.currentTarget.style.borderColor = "#2BBBAD";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "0 2px 24px rgba(43,187,173,0.08), 0 1.5px 6px rgba(43,187,173,0.08)";
                e.currentTarget.style.transform = "scale(1.0)";
                e.currentTarget.style.borderColor = "#e6f7f1";
              }}
            >
              {/* Accent bar */}
              <div style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "50px",
                height: "5px",
                background: "linear-gradient(90deg, #2BBBAD 40%, #43e97b 100%)",
                borderRadius: "6px 6px 16px 16px"
              }} />
              {/* Lottie icon */}
              <div style={{
                margin: "1.2rem auto 1rem",
                background: "#fff",
                borderRadius: "1.5rem",
                boxShadow: "0 1.5px 6px rgba(43,187,173,0.10)",
                padding: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "88px",
                height: "88px"
              }}>
                <Lottie animationData={item.lottie} loop={true} style={{ width: "100px", height: "100px" }} />
              </div>
              {/* Title and description */}
              <h3 style={{
                fontSize: "1.22rem",
                fontWeight: "bold",
                color: "#22a089",
                marginBottom: "0.7rem",
                marginTop: "0"
              }}>{item.title}</h3>
              <p style={{
                fontSize: "1rem",
                color: "#465661",
                lineHeight: "1.7",
                margin: 0
              }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>

        <button style={{
          marginTop: "0.8rem",
          padding: "0.95rem 2.7rem",
          background: "linear-gradient(90deg, #2BBBAD 45%, #43e97b 100%)",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontSize: "1.2rem",
          cursor: "pointer",
          fontWeight: "bold",
          letterSpacing: "0.5px",
          boxShadow: "0 3px 18px rgba(43,187,173,0.13)"
        }}>
          voir plus
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
          marginTop: "0.8rem",
          padding: "0.95rem 2.7rem",
          background: "linear-gradient(90deg, #2BBBAD 45%, #43e97b 100%)",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          fontSize: "1.2rem",
          cursor: "pointer",
          fontWeight: "bold",
          letterSpacing: "0.5px",
          boxShadow: "0 3px 18px rgba(43,187,173,0.13)"
        }}>
          voir plus
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

