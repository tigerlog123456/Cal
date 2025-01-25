import { useEffect } from "react";
import { doc , getDoc } from "firebase/firestore";
import { setDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import '../App.css'
const Agencycode = ({agencycode}) =>{
    const generateUniqueAgencyCode = async() => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 5; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        const docRef = doc(db, 'agencyCodes', result);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return generateUniqueAgencyCode(); // Recursively generate a new code if it already exists
        } else {
            await setDoc(docRef, { code: result }); // Save the generated code
            agencycode(result); // Pass the generated code to the parent
            return result;     
        }
    };
    useEffect(()=>{
        generateUniqueAgencyCode()
    },[])
}
export default Agencycode