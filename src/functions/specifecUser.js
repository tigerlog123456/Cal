import { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';

const SpecificUser = ({ agencycode, agencydata, data, setfetcheddata, agencyId }) => {
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = collection(db, 'users');
                const queries = [];

                // Add queries conditionally
                if (data) queries.push(query(userDoc, where('uid', '==', data)));
                if (agencydata) queries.push(query(userDoc, where('agencyCode', '==', agencydata)));
                if (agencycode) queries.push(query(userDoc, where('agencyCode', '==', agencycode)));
                if (agencyId) queries.push(query(userDoc, where('agencyId', '==', agencyId)));
                // Fetch all queries in parallel
                
                const snapshots = await Promise.all(queries.map((q) => getDocs(q)));
                const results = [];
                snapshots.forEach((snapshot) => {
                    snapshot.forEach((doc) => results.push(doc.data()));
                });

                if (results.length > 0) {
                    setfetcheddata(results); // Log the fetched results
                } else {
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchUserData();
    }, [data, agencycode, agencydata, agencyId, setfetcheddata]);

    // Optionally, handle error rendering
    if (error) {
        return <p>{error}</p>;
    }

    return null;
};

export default SpecificUser;
