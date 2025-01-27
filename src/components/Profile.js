import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';

const Profile = ({ data }) => {
    const [formData, setFormData] = useState({});
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    // Initialize formData based on user type
    useEffect(() => {
        const initialClientData = {
            email: data.email || '',
            age: data.age || '',
            height: data.height || '',
            weight: data.weight || '',
            targetWeight: data.targetWeight || '',
            healthConditions: data.healthConditions || '',
        };

        const initialAgencyData = {
            email: data.email || '',
            ownerName: data.ownerName || '',
            location: data.location || '',
            phoneNumber: data.phonenumber || '',
            agencyName: data.agencyName || '',
            price: data.price || '',
        };

        setFormData(data.userType === 'client' ? initialClientData : initialAgencyData);
    }, [data]);

    // Track form changes
    useEffect(() => {
        const isFormChanged = Object.keys(formData).some(
            (key) => formData[key] !== (data[key] || '')
        );
        setIsButtonDisabled(!isFormChanged);
    }, [formData, data]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            const userRef = doc(db, 'users', data.uid);
            await updateDoc(userRef, formData);
            setIsButtonDisabled(true);
        } catch (error) {
            console.error('Error updating user data:', error);
            alert('Error updating data');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 gray-100 transition duration-300 mt-8">
            <div className="max-w-lg w-full p-6 dark:bg-gray-800 bg-white rounded-lg shadow-lg space-y-6">
                <h1 className="text-2xl font-semibold text-center dark:text-white gray-800">
                    Hello, {formData.email}
                </h1>

                {/* Render form inputs based on user type */}
                <div className="space-y-4">
                    {Object.keys(formData).map((key) => (
                        <input
                            key={key}
                            name={key}
                            value={formData[key]}
                            placeholder={key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, (str) => str.toUpperCase())}
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                        />
                    ))}
                </div>

                {/* Update Button */}
                <button
                    onClick={handleUpdate}
                    disabled={isButtonDisabled}
                    className={`w-full p-3 text-white font-semibold rounded-lg ${
                        isButtonDisabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
                    } transition duration-200`}
                >
                    Update Profile
                </button>
            </div>
        </div>
    );
};

export default Profile;
