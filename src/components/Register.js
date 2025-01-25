import React, { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase-config";
import { doc, setDoc } from "firebase/firestore";
import Registerinfo from "../functions/RegisterInfo";
import Agencycode from "../functions/agencycode";
import '../App.css'; // Include your custom styles if necessary

const RegisterComponent = ({ onLoginClick, darkMode }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [usertype, setUsertype] = useState("client"); // Default usertype
    const [error, setError] = useState("");
    const [registerdata, setRegisterdata] = useState("");
    const [agencycode, setAgencycode] = useState("");

    useEffect(() => {
        if (usertype === "client") {
            setAgencycode(""); // Clear the agency code when usertype is client
        }
    }, [usertype]);

    const handleRegister = async () => {
        const agencyData = {
            agencyCode: agencycode,
            agencyName: registerdata.agencyname,
            ownerName: registerdata.ownername,
            status: registerdata.status,
            location: registerdata.location,
            phonenumber: registerdata.phonenumber,
            rate: registerdata.rate,
            price: registerdata.price,
        };

        const clientData = {
            fullName: registerdata.Fullname,
            age: registerdata.age,
            healthConditions: registerdata.health,
            height: registerdata.height,
            status: registerdata.status,
            targetWeight: registerdata.targetweight,
            weight: registerdata.weight,
            agencyId: "",
        };

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Base user data
            let userDoc = { email: user.email, uid: user.uid, userType: usertype };

            // Add conditional data based on usertype
            if (usertype === "client") {
                userDoc = { ...userDoc, ...clientData };
            } else if (usertype === "agency") {
                userDoc = { ...userDoc, ...agencyData };
            }

            // Save user data to Firestore
            await setDoc(doc(db, "users", user.uid), userDoc);
            alert("Registration successful! Please log in.");
            onLoginClick(); // Navigate back to the login view
            setError("");
        } catch (err) {
            const errorMessages = {
                'auth/user-not-found': 'No account found with this email.',
                'auth/wrong-password': 'Incorrect password. Please try again.',
                'auth/invalid-email': 'Invalid email format.',
                'auth/too-many-requests': 'Too many failed login attempts. Please try again later.',
                'auth/invalid-credential': 'Invalid credentials provided. Please check your email and password.',
            };
            // Set error message based on error code, or default to Firebase error message
            setError(errorMessages[err.code] || 'An unexpected error occurred. Please try again.');
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center dark:bg-gray-900  bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500`}>
            <div className={`bg-white p-6 rounded-lg shadow-lg w-full sm:w-1/2 space-y-6 animate__animated animate__fadeIn dark:bg-gray-800 dark:text-white mt-20`}>
                <h2 className="text-3xl font-semibold text-center mb-4">Register</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:w-2/3">
                    {/* Left side (email, password, usertype) */}
                    <div className="flex flex-col justify-center space-y-4">
                        {/* Email Input */}
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        {/* Password Input */}
                        <input
                            type="password"
                            placeholder="Password"
                            className="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        {/* Usertype Dropdown */}
                        <select
                            value={usertype}
                            onChange={(e) => setUsertype(e.target.value)}
                           className="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="client">Client</option>
                            <option value="agency">Agency</option>
                        </select>

                        {/* Conditional Render for Agency */}
                        {usertype === "agency" && (
                            <Agencycode agencycode={setAgencycode} />
                        )}
                    </div>

                    {/* Right side (Register Info) */}
                    <div className="space-y-4 dark:color-red ">
                        <Registerinfo setusertype={usertype} registerdata={setRegisterdata} />
                    </div>
                </div>

                {/* Register Button */}
                <button
                    onClick={handleRegister}
                    className={`w-full py-3 font-semibold rounded-lg hover:bg-blue-600 transition-all duration-200 mt-4 ${darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}
                >
                    Register
                </button>

                {/* Error Message */}
                {error && <p className="text-red-500 text-sm text-center mt-4">{error}</p>}

                {/* Login Link */}
                <p className="text-center text-sm mt-4 text-gray-600">
                    Already have an account?{" "}
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onLoginClick(); // Trigger the login view
                        }}
                        className="text-blue-500 hover:underline"
                    >
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default RegisterComponent;
