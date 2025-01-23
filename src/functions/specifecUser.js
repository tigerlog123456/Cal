import { useEffect } from 'react';
import '../App.css'
import { useState } from 'react';
import {db} from '../firebase-config';
import { doc, getDoc } from 'firebase/firestore';

const SpecificUser = ({data , setfetcheddata}) =>{
    const [error, setError] = useState(null);

    useEffect(() => {
        if (data) {
            const fetchUserData = async () => {
                try {
                    const userDoc = doc(db, 'users', data);
                    const docSnap = await getDoc(userDoc);

                    if (docSnap.exists()) {
                        const userData = docSnap.data();
                        setfetcheddata(userData); // Correctly call setfetcheddata
                    } else {
                        setError('No user data found.');
                    }
                } catch (err) {
                    setError('Failed to fetch user data.');
                    console.error(err);
                }
            };
            fetchUserData();
        }
    }, [data, setfetcheddata]);
    // Optionally, handle error rendering
    if (error) {
        return <p>{error}</p>;
    }

    return null; 
}

export default SpecificUser