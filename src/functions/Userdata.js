import { useEffect } from 'react';
import '../App.css'
import { useState } from 'react';
import {db} from '../firebase-config';
import { doc, getDoc } from 'firebase/firestore';

    const UserData = ({data, onDataFetched }) => {
        
        const [error, setError] = useState(null);
        const importeddata = data
        useEffect(() => {
            if (importeddata) {
                const fetchUserData = async () => {
                    try {
                        const userDoc = doc(db, 'users', importeddata.uid);
                        const docSnap = await getDoc(userDoc);
                        if (docSnap.exists()) {
                            const userData = docSnap.data();
                            onDataFetched(userData); // Pass the fetched data to Homepage
    
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
        }, [importeddata, onDataFetched]);
        return null; // Since this component only fetches data, no UI is rendered here
    };

export default UserData;