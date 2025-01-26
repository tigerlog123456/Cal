import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

const Profile = ({ data }) => {
    // Initial state from data prop
    const initialData = {
        email: data.email || "",
        age: data.age || "",
        height: data.height || "",
        weight: data.weight || "",
        targetWeight: data.targetWeight || "",
        healthConditions: data.healthConditions || ""
    };

    // State for the form fields
    const [email, setEmail] = useState(initialData.email);
    const [age, setAge] = useState(initialData.age);
    const [height, setHeight] = useState(initialData.height);
    const [weight, setWeight] = useState(initialData.weight);
    const [targetweight, setTargetweight] = useState(initialData.targetWeight);
    const [health, setHealth] = useState(initialData.healthConditions);
    
    // State to track if the button should be disabled
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    
    // Dark mode state
    const [darkMode, setDarkMode] = useState(false);

    // Handle form change detection
    useEffect(() => {
        const isFormChanged = email !== initialData.email ||
            age !== initialData.age ||
            height !== initialData.height ||
            weight !== initialData.weight ||
            targetweight !== initialData.targetWeight ||
            health !== initialData.healthConditions;

        setIsButtonDisabled(!isFormChanged);
    }, [email, age, height, weight, targetweight, health, initialData]);

    const handleUpdate = async () => {
        const userData = {
            email: email,
            age: age,
            height: height,
            weight: weight,
            targetWeight: targetweight,
            healthConditions: health
        };

        try {
            const userRef = doc(db, 'users', data.uid);
            await updateDoc(userRef, userData);
        
            // Reset the button state after successful update
            setIsButtonDisabled(true);
        } catch (error) {
            console.error('Error updating user data:', error);
            alert('Error updating data');
        }
    };

    // Toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={`min-h-screen flex items-center justify-center dark:bg-gray-900 gray-100 transition duration-300 mt-8`}>
            <div className={`max-w-lg w-full p-6 dark:bg-gray-800 bg-white rounded-lg shadow-lg space-y-6`}>
                <h1 className="text-2xl font-semibold text-center dark:text-white gray-800">Hello, {email}</h1>
                
                {/* Form Inputs */}
                <div className="space-y-4">
                    <input
                        value={email}
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    />
                    <input
                        value={age}
                        placeholder="Age"
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    />
                    <input
                        value={height}
                        placeholder="Height"
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    />
                    <input
                        value={weight}
                        placeholder="Weight"
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    />
                    <input
                        value={targetweight}
                        placeholder="Target Weight"
                        onChange={(e) => setTargetweight(e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    />
                    <input
                        value={health}
                        placeholder="Health"
                        onChange={(e) => setHealth(e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                    />
                </div>

                {/* Update Button */}
                <button
                    onClick={handleUpdate}
                    disabled={isButtonDisabled}
                    className={`w-full p-3 text-white font-semibold rounded-lg ${isButtonDisabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} transition duration-200`}
                >
                    Update Profile
                </button>

                {/* Dark Mode Toggle */}
                
            </div>
        </div>
    );
};

export default Profile;
