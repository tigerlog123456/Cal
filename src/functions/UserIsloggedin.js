import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase-config';
import '../App.css'
const UserisLoggedIn = ({data ,  setUserIsLogged }) => {
    useEffect(() => {
        // Check if user is already logged in
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) { setUserIsLogged({ uid: user.uid, email: user.email, }); } 
            else { setUserIsLogged(null); }
        });
     // Cleanup the listener on unmount
        return () => unsubscribe();
    }, [setUserIsLogged]);
    // No UI rendered by this component
    return null;
};

export default UserisLoggedIn;