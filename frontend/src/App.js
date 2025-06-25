import React from "react";
import { Routes, Route } from "react-router-dom";
import Welcome from "./components/welcome";
import Formulaire from "./components/Formulaire";
import BodySelector from "./components/BodySelector";
import HomeMenu from "./components/HomeMenu"; // 👈 importe ton composant
import Inscription from "./components/Inscription";
import Login from "./components/Login";
import Historique from "./components/historique";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/menu" element={<HomeMenu />} />   {/* 👈 route ajoutée */}
      <Route path="/assistant" element={<BodySelector />} />
      <Route path="/predict" element={<Formulaire />} />
      <Route path="/inscription" element={<Inscription/>}/>
      <Route path="/menu" element={<HomeMenu />} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/historique" element={<Historique />} />


    </Routes>
  );
}

export default App;
