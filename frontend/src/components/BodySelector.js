import React, { useState, useEffect } from "react";
import { BrowserRouter } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';



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
    text: "Avez-vous observé des changements dans la couleur ou la fréquence de votre urine ?",
    symptomMap: {
      "Urine mousseuse": "Urine mousseuse",
      "Urine foncée": "Urine foncée",
      "Besoin fréquent d’uriner la nuit": "Besoin fréquent d’uriner la nuit"
    },
    options: ["Aucun changement", "Urine mousseuse", "Urine foncée", "Besoin fréquent d’uriner la nuit"]
  },
  {
    id: 3,
    text: "Avez-vous des antécédents médicaux ou des conditions telles que le diabète ou l’hypertension ?",
    symptomMap: {
      "Hypertension": "Hypertension",
      "Diabète": "Diabète",
      "Antécédents familiaux de maladies rénales": "Antécédents familiaux de maladies rénales"
    },
    options: ["Aucun", "Hypertension", "Diabète", "Antécédents familiaux de maladies rénales"]
  }
];

export default function RenalSymptomChat() {
  const navigate = useNavigate(); // ✅ bien placé ici

  const [step, setStep] = useState(-1);
  const [chat, setChat] = useState([]);
  const [writing, setWriting] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [symptoms, setSymptoms] = useState([]);
  const [backendResults, setBackendResults] = useState(null);
  const [predictResult, setPredictResult] = useState(null);

  const goToApp = () => {
    navigate("/SymptomSelector"); // ou "/app"
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const next = async () => {
    setWriting(true);
    await delay(1000);
    const newStep = step + 1;
    setStep(newStep);

    const q = questions[newStep];
    setChat((prev) => [...prev, { type: "bot", text: q.text }]);
    setWriting(false);
  };

  const handleOptionClick = async (option) => {
    const question = questions[step];
    const translated = question.symptomMap?.[option];
    if (translated && translated !== "Aucun symptôme" && translated !== "Aucun changement" && translated !== "Aucun") {
      setSymptoms((prev) => [...prev, translated]);
    }

    setChat((prev) => [...prev, { type: "user", text: option }]);
    await delay(500);

    if (step < questions.length - 1) {
      next();
    } else {
      finishConversation();
    }
  };

  const finishConversation = async () => {
    setWriting(true);
    await delay(1000);
    setChat((prev) => [...prev, { type: "bot", text: "Merci. Je vais maintenant analyser vos réponses..." }]);

    const response = await fetch("http://127.0.0.1:8000/api/analyse-symptomes/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ symptoms })
    });

    const data = await response.json();
    setBackendResults(data);

    const prediction = await fetch("http://127.0.0.1:8000/api/predict/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data.recommanded_tests.reduce((acc, curr) => {
        acc[curr] = 0;
        return acc;
      }, {}))
    });

    const predictionData = await prediction.json();
    setPredictResult(predictionData.prediction);
    setWriting(false);
  };

  useEffect(() => {
    next();
  }, []);

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto">
      {chat.map((msg, index) => (
        <div key={index} className={`p-2 rounded ${msg.type === "bot" ? "bg-gray-200 text-left" : "bg-blue-200 text-right"}`}>
          {msg.text}
        </div>
      ))}

      {writing && <div className="italic text-gray-500">Le robot écrit...</div>}

      {!writing && step >= 0 && step < questions.length && (
        <div className="flex flex-wrap gap-2">
          {questions[step].options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionClick(option)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {option}
            </button>
          ))}
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
