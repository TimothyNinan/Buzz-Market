import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { useAuth } from './AuthContext';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        
        try {
            const response = await fetch('http://127.0.0.1:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                login(data.token, email)
                navigate('/home')
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            console.error('Login error', error);
        }
    };

    const handleSignupRedirect = () => {
        navigate('/signup');
    };

    return (
        <div className="login-page">
            <form onSubmit={handleLogin} className="login-form">
                <h2>Buzz Market</h2>
                {error && <p className="error-message">{error}</p>}
                <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required/>
                <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
                <button type="submit" className="login-button">Login</button>
                <button type="button" className="signup-button" onClick={handleSignupRedirect}>Sign Up</button>
            </form>
        </div>
    );
}

export default Login;