import React, { useState } from "react";
import './css/style.css'
import api from '../api'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
//import 'bootstrap/dist/css/bootstrap.min.css';  
import {Container , Button} from 'react-bootstrap'  
function Login() {
    const navigate = useNavigate();
    const initialState = {
        email: "",
        password: "",
    }
    const [state, setState] = useState(initialState)
    const { email, password } = state;
    const authenticate = (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Complétez les champs!")
        }
        else {
            api.post('/user/login', {
                email,
                password
            }).then((response) => {
                setState({ email: "", password: "" });
                navigate('/accueil')
                localStorage.setItem('role', response.data.role);
                toast.success("Vous êtes connecté avec succès")

            }).catch((err) => {
                if (err.response)
                    toast.error(`Il y a une erreur d'authentification`);
            });
        }
    }
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setState({ ...state, [name]: value });
    }
    return (
        <div className="form-v5">
            <div className="page-content">
                <div className="form-v5-content">
                    <form className="form-detail" onSubmit={authenticate}>
                        <h2>Connectez-vous</h2>
                        <div className="form-row">
                            <label htmlFor="your-email">Entrez votre email</label>
                            <input type="text" name="email" id="email" className="input-text" placeholder="Email" required pattern="[^@]+@[^@]+.[a-zA-Z]{2,6}" value={email} onChange={handleInputChange} />
                            <i className="fas fa-envelope"></i>
                        </div>
                        <div className="form-row">
                            <label htmlFor="password">Entrez votre mot de passe</label>
                            <input type="password" name="password" id="password" className="input-text" placeholder="Mot de passe" required value={password} onChange={handleInputChange} />
                            <i className="fas fa-lock"></i>
                        </div>
                        <Container className='p-4'>
                            <Button type="submit" variant="primary" size="md" active>
                                Se connecter
                            </Button>{' '}
                            <Button variant="success" size="md" active onClick={() => {navigate('/signup')}}>
                                Créer un compte
                            </Button>
                        </Container>
                    </form>
                </div>
            </div>
        </div>
    )

}

export default Login;