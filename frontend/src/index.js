import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom'; // ✅ IMPORT NECESSAIRE
import BodySelector from "./components/BodySelector";




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* ✅ WRAPPER OBLIGATOIRE POUR LES ROUTES */}
    
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Si tu veux mesurer la perf :
reportWebVitals();
