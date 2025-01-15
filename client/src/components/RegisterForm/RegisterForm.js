import React, { useState } from 'react';
import axios from 'axios';



const RegisterForm = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {

        console.log(e);

        e.preventDefault();

        try {

            const response = await axios.post('http://localhost:4000/users/register', {
                email,
                password,
            });

            if (response.data) {
                setMessage('Registration successful!');
            }

        } catch (error) {
            console.error('Error during registration:', error);
            setMessage('Error during registration. Please try again.');

        }


    }






    return (
        <div>
            <h2>Inscription</h2>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Email :</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password :</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}



export default RegisterForm;
