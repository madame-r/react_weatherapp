import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";  // Assurez-vous que vous importez le UserContext correctement
import './LoginForm.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');  // Pour gérer les erreurs
  const { loginUser, loading } = useUser();  // On récupère la fonction loginUser et le statut loading depuis le UserContext
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrorMessage(''); // Réinitialiser le message d'erreur à chaque soumission

    try {
      // Appel de la fonction loginUser du UserContext
      await loginUser(email, password);

      // Si tout va bien, on redirige vers la page d'accueil
      navigate('/');  // Changer la route selon tes besoins

    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('Login failed. Please check your credentials and try again.');  // Affichage d'un message d'erreur
    }
  };

  if (loading) {
    return <p>Loading...</p>; // Afficher un message de chargement ou un spinner
  }

  return (
    <main className="main-login">
      <h2>Login to your account</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Affichage du message d'erreur */}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder='Email'
            className="input-login"
          />
        </div>
        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder='Password'
            className="input-login"
          />
        </div>
        <button type="submit" className="button-login">Login</button>
      </form>
    </main>
  );
};

export default LoginForm;