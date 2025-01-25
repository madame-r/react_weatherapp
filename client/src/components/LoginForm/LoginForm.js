import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import './LoginForm.css';

const LoginForm = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { loginUser } = useUser();
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            await loginUser(email, password);
            navigate('/');

        } catch (error) {

            console.error('Login failed:', error);

        }

    };


    return (
        <main className="main-login">
            <h2>Login to your account</h2>
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
                <button type="submit" className="button-login">Send</button>
            </form>
        </main>
    );

};

export default LoginForm