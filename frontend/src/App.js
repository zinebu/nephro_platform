import React from "react";
import { Routes, Route } from "react-router-dom";
import Welcome from "./components/welcome";
import Formulaire from "./components/Formulaire";
import BodySelector from "./components/BodySelector";
import HomeMenu from "./components/HomeMenu"; // 👈 importe ton composant
import AuthPage from "./components/AuthPage"; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/menu" element={<HomeMenu />} />   {/* 👈 route ajoutée */}
      <Route path="/assistant" element={<BodySelector />} />
      <Route path="/predict" element={<Formulaire />} />
      <Route path="/connexion" element={<AuthPage/>}/>
      <Route path="/menu" element={<HomeMenu />} />


    </Routes>
  );
}

export default App;
