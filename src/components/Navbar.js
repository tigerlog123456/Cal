import { useEffect, useState } from "react"
import SpecificUser from "../functions/specifecUser"
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config"; // Import your Firebase auth instance
const Navbar = ({data}) =>{
    const [fetcheddata , setfetcheddata] = useState()
    useEffect(()=>{
        if (data) {
         
        }
    },[data])
  const handleLogout= async()=>{
        try {
            await signOut(auth); // Logs the user out of Firebase
            console.log("User logged out successfully");
            window.location.reload();
            // Optionally, redirect the user or clear local state here
        } catch (error) {
            console.error("Error during logout:", error);
        }
    }
    return(
        // Navbar Div
        <div>
            <p>logo</p>
            {data && data.agencyId == null && data.userType === "client" && (
                // Need to make it as Button
                <div>
                    <p>connect to agency</p> 
                    
                </div>
            )}
             {data && data.agencyId != null && (
                // Agency name if found instead of the button
                <div>
                    <SpecificUser data={data.agencyId} setfetcheddata={setfetcheddata} />
                    {fetcheddata.agencyName}
                </div>
            )}
            <p>home</p>
            <p>profile</p>
            {data &&(
                // Logout Button
                <button onClick={handleLogout}>
                    Logout
                </button>
            )}
            
        </div>
    )
}

export default Navbar