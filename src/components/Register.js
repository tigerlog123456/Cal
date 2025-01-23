import React, { useEffect, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase-config";
import { doc, setDoc } from "firebase/firestore";
import Registerinfo from "../functions/RegisterInfo";
import Agencycode from "../functions/agencycode";
import '../App.css'
const RegisterComponent = ({ onLoginClick }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [usertype, setUsertype] = useState("client"); // Default usertype
    const [error, setError] = useState("");
    const [registerdata , setregisterdata] = useState("")
    const [agencycode , setagencycode] = useState("")

    useEffect(() => {
        if (usertype === "client") {
            setagencycode(""); // Clear the agency code when usertype is client
        }
    }, [usertype]);
    const handleRegister = async () => {
        const agencydata = {
            agencyCode : agencycode,
            agencyName : registerdata.agencyname,
            ownerName : registerdata.ownername,
            status : registerdata.status,
            location : registerdata.location,
            phonenumber : registerdata.phonenumber,
            rate : registerdata.rate
        }
        const clientdata = {
            fullName : registerdata.Fullname,
            age : registerdata.age,
            healthConditions : registerdata.health,
            height : registerdata.height,
            status : registerdata.status,
            targetWeight : registerdata.targetweight,
            weight : registerdata.weight,
            agencyId : null
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Base user data
            let userDoc = { email: user.email, uid: user.uid, userType: usertype };   
            // Add conditional data based on usertype
            if (usertype === "client") {
                userDoc = { ...userDoc, ...clientdata} // Assuming registerdata holds client-specific data
            } else if (usertype === "agency") {
                userDoc = { ...userDoc, ...agencydata}; // Spread agency-specific fields
            }  
            // Save user data to Firestore
            await setDoc(doc(db, "users", user.uid), userDoc);    
            alert("Registration successful! Please log in.");
            onLoginClick(); // Navigate back to the login view
            setError("")
        } catch (err) {
            const errorMessages = {
                'auth/user-not-found': 'No account found with this email.',
                'auth/wrong-password': 'Incorrect password. Please try again.',
                'auth/invalid-email': 'Invalid email format.',
                'auth/too-many-requests': 'Too many failed login attempts. Please try again later.',
                 'auth/invalid-credential': 'Invalid credentials provided. Please check your email and password.',
            };
            // Set error message based on error code, or default to Firebase error message
            setError(errorMessages[error.code] || 'An unexpected error occurred. Please try again.');
        }
    };
    return (
        // Register Form their is additional in Registerinfo file        
        <div>
 
            {usertype === "agency" && <Agencycode agencycode={setagencycode} />}

            <h2>Register</h2>
            <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <select value={usertype} onChange={(e) => setUsertype(e.target.value)}>
                <option value="client">Client</option>
                <option value="agency">Agency</option>
            </select>

            <Registerinfo setusertype={usertype} registerdata={setregisterdata}/>

            <button onClick={handleRegister}>Register</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <p>
                Already have an account?{" "}
                <a href="#" onClick={(e) => {
                    e.preventDefault();
                    onLoginClick(); // Trigger the login view
                }}>
                    Login
                </a>
            </p>
        </div>
    );
};

export default RegisterComponent;