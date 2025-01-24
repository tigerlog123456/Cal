import React, {useState , useCallback } from "react";
import UserData from "../functions/Userdata";
import LoginComponent from "../components/Login";
import ClientDashboard from "../components/ClientDashboard";
import UserisLoggedIn from "../functions/UserIsloggedin";
import AgencyDashboard from "../components/AgencyDashboard";
import AdminDashboard from "../components/AdminDashboard";
import Register from "../components/Register";

import '../App.css'
import Navbar from "../components/Navbar";
function Homepage ( {ontrigger}) {
  const [user , setUser] = useState(null);
  const [userislogged, setUserisLogged] = useState(null);
  const [showRegister, setShowRegister] = useState(false); 
const handleDataFetched = useCallback((data) => {
  setUser(data); // Store the fetched data
}, []);

const handleLoggedIn = useCallback((loggedData) => {
  setUserisLogged(loggedData); // Update userislogged state
}, []);

const renderDashboard = () => {
  if (!user || !user.userType) return null;

  switch (user.userType) {
      case "client":
          return (<>
          <ClientDashboard data={user} />   
           </>
          )
      case "agency":
          return <AgencyDashboard data={user}/>;
      case "admin":
          return <AdminDashboard data={user} />;
      default:
          return <p>Invalid user type. Please contact support.</p>;
  }
};
    // Handle conditional rendering before the return statement
  return (
    
   <div> 
    <Navbar data={user}/>
    <UserisLoggedIn data={user} setUserIsLogged={handleLoggedIn} />
    {userislogged && (<UserData userdata={user} data={userislogged} onDataFetched={handleDataFetched} />)}
    {!userislogged && !showRegister && <LoginComponent setUserData={setUserisLogged} onRegisterClick={() => setShowRegister(true)} />}
    {!userislogged && showRegister && (
    <Register onLoginClick={() => setShowRegister(false)} />
    )}
    {renderDashboard()}
   </div>
  );
}
export default Homepage;