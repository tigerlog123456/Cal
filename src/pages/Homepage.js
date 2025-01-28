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
import Market from "../functions/addMarket";
function Homepage ( {ontrigger}) {
  const [user, setUser] = useState(null);
  const [userislogged, setUserisLogged] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [isProfileView, setIsProfileView] = useState(false);
  const [marketview, setMarketview] = useState(false);
  const [home, setHome] = useState(true);

  const handleDataFetched = useCallback((data) => {
    setUser(data); // Store fetched data
  }, []);

  const handleLoggedIn = useCallback((loggedData) => {
    setUserisLogged(loggedData); // Update logged-in state
  }, []);

  const handleMarketClick = () => {
    setIsProfileView(false);
    setHome(false);
    setMarketview(true); // Activate Market view
  };
  const handleProfileView = () => {
    setIsProfileView(true);
    setHome(false);
    setMarketview(false); // Activate Profile view
  };

  const handleHomeView = () => {
    setHome(true);
    setIsProfileView(false);
    setMarketview(false); // Activate Home view
  };
  const renderDashboard = () => {
    if (!user || !user.userType) return null;

    const renderContent = () => {
      if (isProfileView) return <Profile data={user} />;
      if (marketview) return <Market data={user} />;
      if (home) {
        switch (user.userType) {
          case "client":
            return <ClientDashboard data={user} />;
          case "agency":
            return <AgencyDashboard data={user} />;
          case "admin":
            return <AdminDashboard data={user} />;
          default:
            return <p>Invalid user type. Please contact support.</p>;
        }
      }
      return null;
    };

    return renderContent();
  };
    // Handle conditional rendering before the return statement
  return (
    
    <div className="dark:bg-gray-800">
    <Navbar
      data={user}
      onProfileClick={handleProfileView}
      onHomeClick={handleHomeView}
      onMarketClick={handleMarketClick}
    />
    <UserisLoggedIn data={user} setUserIsLogged={handleLoggedIn} />
    {userislogged && (
      <UserData userdata={user} data={userislogged} onDataFetched={handleDataFetched} />
    )}
    {!userislogged && !showRegister && (
      <LoginComponent setUserData={setUserisLogged} onRegisterClick={() => setShowRegister(true)} />
    )}
    {!userislogged && showRegister && (
      <Register onLoginClick={() => setShowRegister(false)} />
    )}
    {renderDashboard()}
  </div>
  );
}
export default Homepage;