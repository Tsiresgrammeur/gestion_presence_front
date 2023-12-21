import React, { useState } from "react";
import api from '../api'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button } from 'react-bootstrap'

function Signup() {
	const navigate = useNavigate();
	const initialState = {
		username: "",
		email: "",
		password: "",
		new_password: ""
	}
	const [state, setState] = useState(initialState)
	const { username, email, password, new_password } = state;
	const signup = (e) => {
		e.preventDefault();
		if (!username || !email || !password) {
			toast.error("Veuillez complétez les champs!")
		}
		else if (password != new_password) {
			toast.error("Veuillez entrer deux mot de passe identique")
		}
		else {
			api.post('/user', {
				username,
				email,
				password
			}).then((response) => {
				console.log(response)
				setState({ username: "", email: "", password: "" });
				navigate('/accueil')
				localStorage.setItem('role', "simple_user");
				toast.success("Vous êtes connecté avec succès")

			}).catch((err) => {
				if (err.response)
					toast.error(err.response.data.message);
				else {
					toast.error("une erreur a survenu");
				}
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
					<form className="form-detail" onSubmit={signup}>
						<h2>Formulaire de création de compte</h2>
						<div className="form-row">
							<label htmlFor="username">Nom de l'utilisateur</label>
							<input type="text" name="username" id="username" value={username} onChange={handleInputChange} className="input-text" placeholder="Entrez votre nom" required />
							<i className="fas fa-user"></i>
						</div>
						<div className="form-row">
							<label htmlFor="email">Votre email</label>
							<input type="text" name="email" id="email" value={email} onChange={handleInputChange} className="input-text" placeholder="Entrez votre email" required pattern="[^@]+@[^@]+.[a-zA-Z]{2,6}" />
							<i className="fas fa-envelope"></i>
						</div>
						<div className="form-row">
							<label htmlFor="password">Votre mot de passe</label>
							<input type="password" name="password" id="password" onChange={handleInputChange} value={password} className="input-text" placeholder="Entrez votre mot de passe" required />
							<i className="fas fa-lock"></i>
						</div>

						<div className="form-row">
							<label htmlFor="new_password">Répétez votre mot de passe</label>
							<input type="password" name="new_password" id="new_password" onChange={handleInputChange} value={new_password} className="input-text" placeholder="Répetez votre mot de passe" required />
							<i className="fas fa-lock"></i>
						</div>

						<div className="form-row-last">
							<Container className='p-4'>
								<Button type="submit" variant="success" size="lg" active>
									Créer un compte
								</Button>{' '}
								<Button variant="primary" size="lg" active onClick={() => { navigate('/login') }}>
									Se connecter
								</Button>
							</Container>
						</div>
					</form>
				</div>
			</div>
		</div>
	)

}

export default Signup