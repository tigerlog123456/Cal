import React, {useState , useCallback } from "react";
import UserData from "../functions/Userdata";
import LoginComponent from "../components/Login";
import ClientDashboard from "../components/ClientDashboard";
import UserisLoggedIn from "../functions/UserIsloggedin";
import AgencyDashboard from "../components/AgencyDashboard";
import AdminDashboard from "../components/AdminDashboard";
import Register from "../components/Register";
import Profile from "../components/Profile";
import '../App.css'
import Navbar from "../components/Navbar";
function Homepage ( {ontrigger}) {
  const [user , setUser] = useState(null);
  const [userislogged, setUserisLogged] = useState(null);
  const [showRegister, setShowRegister] = useState(false); 
  const [isProfileView, setIsProfileView] = useState(false); 
  const [home , setHome] = useState(true)
const handleDataFetched = useCallback((data) => {
  setUser(data); // Store the fetched data
}, []);

const handleLoggedIn = useCallback((loggedData) => {
  setUserisLogged(loggedData); // Update userislogged state
}, []);
const handleProfileView = () => {
  setIsProfileView(true); // Set isProfileView to true
  setHome(false); // Ensure home is false when viewing the profile
};

const handleHomeView = () => {
  setHome(true); // Set home to true
  setIsProfileView(false); // Ensure profile is false when viewing the home/dashboard
};
const renderDashboard = () => {
  if (!user || !user.userType) return null;
  switch (user.userType) {
      case "client":
          return (
            <>
            {isProfileView ? (
              <Profile data={user} /> // Render Profile if isProfileView is true
            ) : (
              home && <ClientDashboard data={user} /> // Render ClientDashboard if home is true and isProfileView is false
            )}
          </>
          )
      case "agency":
          return (
            <>
            {isProfileView ? (
              <Profile data={user} /> // Render Profile if isProfileView is true
            ) : (
              home && <AgencyDashboard data={user} /> // Render ClientDashboard if home is true and isProfileView is false
            )}
          </>
          );
      case "admin":
          return <AdminDashboard data={user} />;
      default:
          return <p>Invalid user type. Please contact support.</p>;
  }
};
    // Handle conditional rendering before the return statement
  return (
    
   <div> 
   <Navbar
        data={user}
        onProfileClick={handleProfileView} // Call handleProfileView when profile button is clicked
      onHomeClick={handleHomeView} // Call handleHomeView when home button is clicked
         // Pass callback to Navbar
      />
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