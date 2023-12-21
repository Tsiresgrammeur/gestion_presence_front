import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from './template/Navbar/Navbar';
import Accueil from './Accueil/Accueil';
import Eleve from './Eleve/Eleve';
import Professeur from './Professeur/Professeur';
import Matiere from './Matiere/Matiere';
import Presence from './Presence/Presence';
import Login from './Login/Login';
import Signup from './Signup/Signup';
import { useEffect, useState } from 'react';


function App() {
  const [logged, setLogged] = useState(false)
  useEffect(() =>{
    localStorage.getItem('role') ? setLogged(true): setLogged(false)
  },[])

  return (
    <div className="App">

        <main>
          <ToastContainer autoClose={3000} position={toast.POSITION.BOTTOM_RIGHT} />
          <BrowserRouter>
        <Navbar />
            <Routes>
              <Route index element={logged ? <Accueil />: <Login />} />
              <Route path="accueil" element={<Accueil />} />
              <Route path="eleve" element={<Eleve />} />
              <Route path="professeur" element={<Professeur />} />
              <Route path="matiere" element={<Matiere />} />
              <Route path="presence" element={<Presence />} />
              <Route path="login" element={<Login />} />
              <Route path="signup" element={<Signup />} />
            </Routes>
          </BrowserRouter>
        </main>
      </div>
  );
}

export default App;
