import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from '../firebase-config'
import '../App.css'
const LoginComponent = ({setUserData , onRegisterClick }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in successfully
                const user = userCredential.user;
                const userData = { email: user.email, uid: user.uid };
                setUserData(userData);
                setError('');
            })
            .catch((error) => {
                const errorMessages = {
                    'auth/user-not-found': 'No account found with this email.',
                    'auth/wrong-password': 'Incorrect password. Please try again.',
                    'auth/invalid-email': 'Invalid email format.',
                    'auth/too-many-requests': 'Too many failed login attempts. Please try again later.',
                     'auth/invalid-credential': 'Invalid credentials provided. Please check your email and password.',
                };
                // Set error message based on error code, or default to Firebase error message
                setError(errorMessages[error.code] || 'An unexpected error occurred. Please try again.');
            });
    };
    const handleEmailChange = (e) => {
        const newEmail = e.target.value;
        if (newEmail !== email) { setEmail(newEmail); }
    };
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        if (newPassword !== password) { setPassword(newPassword); }
    };
    return (
        <div>
            <h2>Login</h2>
            <input 
                type="email" 
                placeholder="Email" 
                onChange={handleEmailChange} 
            />
            <input 
                type="password" 
                placeholder="Password" 
                onChange={handlePasswordChange} 
            />
            <button onClick={handleLogin}>Login</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>
                Don't have an account?{" "}
                <a href="#" onClick={(e) => {
                    e.preventDefault();
                    onRegisterClick(); // Trigger the register view
                }}>
                    Register
                </a>
            </p>
        </div>
    );
};

export default LoginComponent;