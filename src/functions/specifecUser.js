import { useEffect } from 'react';
import '../App.css'
import { useState } from 'react';
import {db} from '../firebase-config';
import {collection, getDocs, query, where } from 'firebase/firestore';

const SpecificUser = ({agencycode, agencydata , data , setfetcheddata}) =>{
    const [error, setError] = useState(null);
    useEffect(() => {
        if (data) { 
            const fetchUserData = async () => {
                try {
                    const userDoc = collection(db, 'users');
                    const query1 = query(userDoc, where("uid", "==", data));
                    const query2 = query(userDoc, where("agencyCode", "==", agencydata));
                    const query3 = query(userDoc, where("agencyCode", "==", agencycode));
                    const [snapshot1, snapshot2 , snapshot3 ] = await Promise.all([
                        getDocs(query1),
                        getDocs(query2),
                        getDocs(query3),
                      ]);
                      const results = [];
                      snapshot1.forEach((doc) => results.push(doc.data()));
                      snapshot2.forEach((doc) => results.push(doc.data()));
                      snapshot3.forEach((doc) => results.push(doc.data()));
                 
                      if (results.length > 0) {
                        setfetcheddata(results); 
                       // Assuming you want the first matched document
                    } else {
                        setError("No matching documents found.");
                    }
                } catch (err) {
                    setError('Failed to fetch user data.');
                    console.error(err);
                }
            };
            fetchUserData();
        }
    }, [data , agencycode , agencydata, setfetcheddata]);
    // Optionally, handle error rendering
    if (error) {
        return <p>{error}</p>;
    }
    return null; 
}

export default SpecificUser