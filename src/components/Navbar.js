import { useEffect, useState } from "react"
import SpecificUser from "../functions/specifecUser"
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config"; // Import your Firebase auth instance
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import Addrate from "../functions/Rateimport";
const Navbar = ({data , ontrigger}) =>{
    const navigate = useNavigate()
    const [fetcheddata , setfetcheddata] = useState()
    const [showOverlay, setShowOverlay] = useState(false);
    const [agencyInput, setAgencyInput] = useState("");
    const [fetchedd , setfetchdd] = useState()
    const [isConnectedToAgency, setIsConnectedToAgency] = useState(data?.agencyId == ""); // Track if connected to agency
    useEffect(()=>{
        if(data && fetcheddata){
          setfetchdd(fetcheddata)

        }
    },[data , fetcheddata , fetchedd , isConnectedToAgency ])
  const handleLogout= async()=>{
        try {
            await signOut(auth); // Logs the user out of Firebase

            window.location.reload();
            // Optionally, redirect the user or clear local state here
        } catch (error) {
            console.error("Error during logout:", error);
        }
    }
    const handleconnect = () => {
        setShowOverlay(true); // Show the overlay when the connect button is clicked
      };
    
      const handleOverlaySubmit = async() => {
        if (!data || !data.uid) {
            console.error("User data or UID is missing.");
            return;
        }
        if (fetchedd && fetchedd.length > 1) {
            try {
                const userDocRef = doc(db, "users", data.uid); // Reference to the user's document
                await updateDoc(userDocRef, {
                    agencyId: agencyInput, // Update the agencyId field
                });
                setShowOverlay(false); // Hide the overlay after submission
                setIsConnectedToAgency(true);
            } catch (error) {
                console.error("Error updating agency ID:", error);
            }
        } else {
            console.log("fetchedd is undefined, not an array, or doesn't have a second element.");
        }
      };
      const handleOverlayClose = () => {
        setShowOverlay(false); // Hide the overlay without submitting
      };
    return(
        // Navbar Div
        <div>
            <p>logo</p>
            {data && data.agencyId === "" && data.userType === "client" && !isConnectedToAgency && (
        // Only show the "Connect to Agency" button if not already connected
        <div>
          <button onClick={handleconnect}>Connect to Agency</button>
        </div>
      )}
             {data && data.agencyId !== " " && data.userType === "client" && (
                // Agency name if found instead of the button
                <div>
                    <SpecificUser agencycode={data.agencyId} agencydata={agencyInput} data={data.uid} setfetcheddata={setfetcheddata} />
                  {fetchedd && fetchedd.length > 1 && (
                    <>
                    
                    <p>{fetchedd[1].agencyName}</p>
                    <Addrate data={fetchedd} />
                    </>
                  )}
                </div>
            )}
            {
                <a href="#" onClick={(e) => {
                    e.preventDefault();
                    navigate('/Cal')
                }}>Home</a>
            }
            {data && (
              <p>profile</p>
            )}

            
            {data &&(
                // Logout Button
                <button onClick={handleLogout}>
                    Logout
                </button>
            )}
            {showOverlay && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            <h2>Connect to Agency</h2>
            <input
              type="text"
              placeholder="Enter Agency ID"
              value={agencyInput}
              onChange={(e) => setAgencyInput(e.target.value)}
              style={{
                padding: "10px",
                width: "100%",
                marginBottom: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <button
                onClick={handleOverlaySubmit}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Submit
              </button>
              <button
                onClick={handleOverlayClose}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#f44336",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
        </div>
    )
}

export default Navbar