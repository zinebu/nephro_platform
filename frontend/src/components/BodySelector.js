import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const questions = [
  {
    id: 1,
    text: "Ressentez-vous l’un de ces symptômes : douleur au bas du dos, fatigue ou gonflement des jambes ?",
    symptomMap: {
      "Douleur au bas du dos": "Douleurs dans le bas du dos",
      "Fatigue légère": "Fatigue",
      "Fatigue constante": "Fatigue excessive",
      "Gonflement des jambes": "Gonflement des chevilles"
    },
    options: ["Aucun symptôme", "Douleur au bas du dos", "Fatigue légère", "Fatigue constante", "Gonflement des jambes"]
  },
  {
    id: 2,
    text: "Votre urine a-t-elle changé ? (couleur, odeur, quantité) ou avez-vous ressenti des nausées ?",
    symptomMap: {
      "Urine foncée ou malodorante": "Urines foncées ou rouges",
      "Urine mousseuse": "Urine mousseuse",
      "Urine moins abondante": "Réduction de la quantité d'urine",
      "Nausées fréquentes": "Nausées et vomissements"
    },
    options: ["Aucun symptôme", "Urine foncée ou malodorante", "Urine mousseuse", "Urine moins abondante", "Nausées fréquentes"]
  },
  {
    id: 3,
    text: "Avez-vous remarqué d'autres signes comme perte d'appétit, démangeaisons ou confusion ?",
    symptomMap: {
      "Perte d'appétit": "Perte d'appétit",
      "Démangeaisons": "Démangeaisons persistantes",
      "Confusion": "Confusion",
      "Anémie": "Anémie"
    },
    options: ["Aucun symptôme", "Perte d'appétit", "Démangeaisons", "Confusion", "Anémie"]
  }
];

export default function RenalSymptomChat() {
  const navigate = useNavigate();

  const [step, setStep] = useState(-1);
  const [chat, setChat] = useState([]);
  const [writing, setWriting] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [backendResults, setBackendResults] = useState(null);
  const [predictResult, setPredictResult] = useState(null);

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  useEffect(() => {
    if (step === -1) {
      setWriting(true);
      setTimeout(() => {
        setChat([{ type: "bot", text: "Bonjour ! Je vais vous poser quelques questions." }]);
        setWriting(false);
        setTimeout(() => setStep(0), 500);
      }, 800);
    } else if (step < questions.length && !writing) {
      setWriting(true);
      setTimeout(() => {
        setChat(prev => [...prev, { type: "bot", text: questions[step].text }]);
        setWriting(false);
        setSelectedOptions([]);
      }, 600);
    }
  }, [step]);

  const handleCheckboxChange = (option) => {
    if (option === "Aucun symptôme") {
      setSelectedOptions(["Aucun symptôme"]);
    } else {
      setSelectedOptions(prev =>
        prev.includes(option)
          ? prev.filter(o => o !== option)
          : [...prev.filter(o => o !== "Aucun symptôme"), option]
      );
    }
  };

  const handleNext = async () => {
    const current = questions[step];
    setChat(prev => [...prev, { type: "user", text: selectedOptions.join(", ") || "Aucun" }]);

    if (!selectedOptions.includes("Aucun symptôme")) {
      const newSymptoms = selectedOptions.map(opt => current.symptomMap[opt]).filter(Boolean);
      setSymptoms(prev => [...new Set([...prev, ...newSymptoms])]);
    }

    if (step + 1 < questions.length) {
      setStep(step + 1);
    } else {
      finishConversation();
    }
  };

  const finishConversation = async () => {
    setWriting(true);
    await delay(1000);
    setChat(prev => [...prev, { type: "bot", text: "Merci. Je vais maintenant analyser vos réponses..." }]);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/analyse-symptomes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms })
      });

      const data = await response.json();
      setBackendResults(data);

      const prediction = await fetch("http://127.0.0.1:8000/api/predict/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data.recommanded_tests.reduce((acc, curr) => {
          acc[curr] = 0;
          return acc;
        }, {}))
      });

      const predictionData = await prediction.json();
      setPredictResult(predictionData.prediction);
    } catch (error) {
      setChat(prev => [...prev, { type: "bot", text: "Erreur lors de l'analyse." }]);
    } finally {
      setWriting(false);
    }
  };

  const goToApp = () => {
    navigate("/SymptomSelector");
  };

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      {chat.map((msg, index) => (
        <div key={index} className={`p-2 rounded ${msg.type === "bot" ? "bg-gray-200 text-left" : "bg-blue-200 text-right"}`}>
          {msg.text}
        </div>
      ))}

      {writing && <div className="italic text-gray-500">Le robot écrit...</div>}

      {!writing && step >= 0 && step < questions.length && (
        <div className="flex flex-col space-y-2">
          {questions[step].options.map(option => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => handleCheckboxChange(option)}
              />
              <span>{option}</span>
            </label>
          ))}
          <button
            onClick={handleNext}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Suivant
          </button>
        </div>
      )}

      {predictResult && (
        <div className="mt-6 p-4 bg-green-100 text-green-800 rounded">
          <p className="font-semibold">Diagnostic préliminaire :</p>
          <p>{predictResult}</p>
          <button
            onClick={goToApp}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Aller au diagnostic complet
          </button>
        </div>
      )}
    </div>
  );
}
