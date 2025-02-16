import { useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';

const SpecificUser = ({ agencycode, agencydata, data, setfetcheddata, agencyId }) => {
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
          snapshot.forEach((doc) => {
            results.push({ id: doc.id, ...doc.data() });  // Ensure each result has the document id
          });
        });

        // Remove duplicates based on the 'id' or 'uid' field
        const uniqueResults = results.filter((value, index, self) =>
          index === self.findIndex((t) => t.id === value.id || t.uid === value.uid) // Use 'id' or 'uid' for uniqueness
        );
        if (uniqueResults.length > 0) {
          setfetcheddata(uniqueResults); // Log the unique results
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
  }, [data, agencycode, agencydata, agencyId, setfetcheddata]);

  // Optionally, handle error rendering
  return null;
};

export default SpecificUser;
