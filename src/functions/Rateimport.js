import { useEffect, useState } from "react"
import { doc, setDoc , getDoc ,  updateDoc, increment } from "firebase/firestore"; // Import Firestore methods
import { db } from "../firebase-config"
const Addrate = ({data}) =>{
const [rate , setrate] = useState("")
const [hasRated, setHasRated] = useState(false);
useEffect(()=>{
    checkIfRated();
 } , [data , rate])
 const checkIfRated = async () => {
    if (data[0] && data[1]) {
      const rateRef = doc(db, "AgencyRate", `${data[0].uid}_${data[1].uid}`);
      const rateSnapshot = await getDoc(rateRef);
      if (rateSnapshot.exists()) {
        // If document exists, set `hasRated` to true
        setHasRated(true);
      }
    }
  };
const handlesubmit = async() =>{
    if (data[0] && data[1] && rate) {
        try {
          // Define a document reference for the AgencyRate collection
          const rateRef = doc(db, "AgencyRate" ,`${data[0].uid}_${data[1].uid}`);
          // Set the rate data in Firestore
          await setDoc(rateRef, {
            userId: data[0].uid, // User's UID
            agencyId: data[1].uid, // Agency's UID
            rate: rate, // Rate given by the user
            timestamp: new Date(), // Timestamp of when the rate was submitted
          });   
          const agencyRef = doc(db, "users", data[1].uid); // Reference to the agency document
          const agencySnapshot = await getDoc(agencyRef);
          if (agencySnapshot.exists()) {
            // Increment the rating count by 1
            await updateDoc(agencyRef, {
              rate: increment(1),
            });
          } else {
          }
          // Optionally, you can reset the rate after submission
          setHasRated(true); // Mark as rated
          setrate("");
        } catch (error) {
        }
      } else if (hasRated) {
      }
      else {
      }
}
return(
    <div>
      {hasRated ? (
        <p>Already Rated</p>
      ) : (
        <>
          <select value={rate} onChange={(e) => setrate(e.target.value)} key={1}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <button onClick={handlesubmit}>Submit</button>
        </>
      )}
    </div>
)
}
export default Addrate