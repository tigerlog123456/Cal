import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase-config';
import '../App.css'; // Include your custom styles if necessary
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
const LoginComponent = ({ setUserData, onRegisterClick }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [darkMode, setDarkMode] = useState(false); // New state for dark mode

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
                    'auth/user-not-found': 'No Account Found With This Email.',
                    'auth/wrong-password': 'Incorrect Password. Please Try Again.',
                    'auth/invalid-email': 'Invalid Email Format.',
                    'auth/too-many-requests': 'Too Many Failed Login Attempts. Please Try Again Later.',
                    'auth/invalid-credential': 'Invalid Credentials Provided. Please Check Your Email And Password.',
                };
                // Set error message based on error code, or default to Firebase error message
                setError(errorMessages[error.code] || 'An Unexpected Error Occurred. Please Try Again.');
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

    // Toggle Dark Mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark', !darkMode);
    };

    return (
        <div className={`min-h-screen flex items-center justify-center dark:bg-gray-900  bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500`}>
            <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg w-full sm:w-96 space-y-6 animate__animated animate__fadeIn">
                <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-4">Login</h2>
                <div className="space-y-4">
                    {/* Email Input */}
                    <input
                        type="email"
                        placeholder="Email"
                        className="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={email}
                        onChange={handleEmailChange}
                    />
                    {/* Password Input */}
                    <input
                        type="password"
                        placeholder="Password"
                        className="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                </div>
                {/* Error Message */}
                {error && <p className="text-red-500 font-bold text-sm text-center">{error}</p>}
                {/* Login Button */}
                <Button
                    variant="contained"
                    onClick={handleLogin}
                    className="w-full py-3 bg-blue-500 text-white dark:text-white font-semibold rounded-lg hover:bg-blue-600 transition-all duration-200 dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                    Login
                </Button>
                {/* Register Link */}
                <p className="text-center font-bold text-sm mt-4 text-gray-600 dark:text-gray-400">
                    Don't have an account?{" "}
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onRegisterClick(); // Trigger the register view
                        }}
                        className="text-blue-500 hover:underline dark:text-blue-400"
                    >
                        Register
                    </a>
                </p>
                {/* Dark Mode Toggle Button */}
            </div>
        </div>
    );
};

export default LoginComponent;
