import { useState, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import Button from '@mui/material/Button';
const Profile = ({ data }) => {
    const [formData, setFormData] = useState({});
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);

    // Initialize formData based on user type
    useEffect(() => {
        const initialClientData = {
            fullName: data.fullName || '',
            age: data.age || '',
            height: data.height || '',
            weight: data.weight || '',
            targetWeight: data.targetWeight || '',
            healthConditions: data.healthConditions || '',
        };

        const initialAgencyData = {
            agencyName: data.agencyName || '',
            ownerName: data.ownerName || '',
            location: data.location || '',
            phoneNumber: data.phonenumber || '',
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
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center dark:bg-gray-900 gray-100 transition duration-300">
            <div className="max-w-lg mt-20 w-full p-6 dark:bg-gray-800 bg-white rounded-lg shadow-lg space-y-6">
                <h1 className="text-2xl font-semibold text-center dark:text-white gray-800">
                    Hello, {formData.fullName || formData.ownerName}
                </h1>
                {/* Render form inputs based on user type */}
                <div className="flex flex-col  ">
                    {Object.keys(formData).map((key) => (
                        <>
                        <label className='p-3 dark:text-white'>
                        {
                            {
                                'agencyName': "Agency Name",
                                'location' : 'Location',
                                'ownerName' : 'Owner Name',
                                'phoneNumber' : 'Phone Number',
                                'price' : 'Price',
                                'age' : 'Age',
                                'fullName' : 'Full Name',
                                'healthConditions' : 'Health Condition',
                                'height' : 'Height',
                                'targetWeight' : 'Target Weight',
                                'weight': 'Weight'
                            }[key]
                        }
                        </label>
                        <input
                            key={key}
                            name={key}
                            value={formData[key]}
                            placeholder={key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, (str) => str.toUpperCase())}
                            onChange={handleInputChange}
                            className="w-full p-3 border-2 dark:bg-gray-900 dark:border-gray-800 dark:text-white border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        /></>
                        
                    ))}
                </div>

                {/* Update Button */}
                <Button
                    onClick={handleUpdate}
                    variant='contained'
                    disabled={isButtonDisabled}
                    className={` w-full p-3 !text-white  font-semibold rounded-lg ${
                        isButtonDisabled ? '!bg-gray-600 !cursor-not-allowed' : ' !hover:bg-indigo-700'
                    } transition duration-200`}
                >
                    Update Profile
                </Button>
            </div>
        </div>
    );
};

export default Profile;
