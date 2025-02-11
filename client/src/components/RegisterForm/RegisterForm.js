import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';  // Assurez-vous d'importer le UserContext correctement
import axiosInstance from '../../config/axiosConfig';  // Utilisez axiosInstance pour bénéficier de la configuration partagée
import './RegisterForm.css';
import './RegisterFormMq.css';

const RegisterForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const { loginUser } = useUser();  // On récupère la fonction loginUser depuis le UserContext
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            // Appel à l'API d'enregistrement pour créer l'utilisateur
            const response = await axiosInstance.post('/users/register', {
                email,
                password,
                name
            });

            // Vérifier si l'inscription a été réussie
            if (response.data && response.data.message === 'User created successfully') {
                // Connexion automatique après inscription
                await loginUser(email, password);  // Connexion de l'utilisateur juste après l'inscription

                // Redirection vers la page d'accueil
                navigate('/');  // Changer la route selon tes besoins
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    return (
        <main className='main-register'>
            <h2>Keep your favorite cities!</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder='Name'
                    />
                </div>
                <div>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder='E-mail'
                    />
                </div>
                <div>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder='Password'
                    />
                </div>
                <button type="submit" className='button-signup'>Sign Up</button>
            </form>
        </main>
    );
}

export default RegisterForm;