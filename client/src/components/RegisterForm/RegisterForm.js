import React, { useState } from 'react';
import axios from 'axios';
import './RegisterForm.css';
import './RegisterFormMq.css';



const RegisterForm = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name,setName] = useState('');
    const [message, setMessage] = useState('');

    const handleRegister = async (e) => {

        console.log(e);

        e.preventDefault();

        // console.log('Form data:', { email, password, name });

        try {

            const response = await axios.post('http://localhost:4000/users/register', {
                email,
                password,
                name
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
        <main className='main-register'>
            <h2>Keep your favorite cities !</h2>
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
            {message && <p>{message}</p>}
        </main>
    );
}



export default RegisterForm;
