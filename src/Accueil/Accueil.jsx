import React, { useEffect } from "react";
import api from '../api'
import Banner from './freelance-img.jpg'
import './style.css';
import './responsive.css';
import { Link, useNavigate } from 'react-router-dom';
function Accueil(){
    function getList() {
        api.get("/eleve").then(function (response) {
            console.log(response.data)
        });
    }
    const navigate = useNavigate()

    useEffect(() =>{
        if(!localStorage.getItem('role'))
        {
            navigate('/')
        }
    })


    useEffect(()=>{
        getList();
    },[])
    return(
        <>
        <div className="header_section">
            <div className="header_left">
                <div className="banner_main">
                    <h1 className="banner_taital">Gestion de <br/>présence</h1>
                    <p className="banner_text">Une application web pour gérer les présences des étudiants à l'Ecole Nationale d'Informatique. </p>
                    <div className="contact_bt"><Link to='/matiere'> Commencer</Link></div>
                </div>
            </div>
            <div className="header_right">
                <img src={Banner} className="banner_img"/>
            </div>
        </div>
    </>
    )
}

export default Accueil;