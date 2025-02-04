import React, { useState, useCallback, useEffect } from "react";
import { db } from "../firebase-config"; // Import your Firebase configuration
import { doc, onSnapshot } from "firebase/firestore";
import UserData from "../functions/Userdata";
import LoginComponent from "../components/Login";
import ClientDashboard from "../components/ClientDashboard";
import UserisLoggedIn from "../functions/UserIsloggedin";
import AgencyDashboard from "../components/AgencyDashboard";
import AdminDashboard from "../components/AdminDashboard";
import Register from "../components/Register";
import Profile from "../components/Profile";
import "../App.css";
import Navbar from "../components/Navbar";
import Market from "../functions/addMarket";

function Homepage({ ontrigger }) {
  const [user, setUser] = useState(null);
  const [userislogged, setUserisLogged] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [isProfileView, setIsProfileView] = useState(false);
  const [marketview, setMarketview] = useState(false);
  const [home, setHome] = useState(true);

  // Fetch user data in real-time using Firebase onSnapshot
  useEffect(() => {
    if (userislogged && userislogged.uid) {
      const userRef = doc(db, "users", userislogged.uid);

      // Set up a real-time listener for the user document
      const unsubscribe = onSnapshot(userRef, (doc) => {
        if (doc.exists()) {
          const userData = doc.data();
          setUser(userData); // Update the user state with the latest data
        } else {
          console.log("User document does not exist.");
        }
      });

      // Clean up the listener when the component unmounts
      return () => unsubscribe();
    }
  }, [userislogged]);

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

  return (
    <div className="dark:bg-gray-800">
      <UserisLoggedIn data={user} setUserIsLogged={handleLoggedIn} />
      {userislogged && (
        <UserData
          userdata={user}
          data={userislogged}
          onDataFetched={handleDataFetched}
        />
      )}
      {!userislogged && !showRegister && (
        <LoginComponent
          setUserData={setUserisLogged}
          onRegisterClick={() => setShowRegister(true)}
        />
      )}
      {!userislogged && showRegister && (
        <Register onLoginClick={() => setShowRegister(false)} />
      )}
      {user && user.status === "Inactive" ? (
        <>
          <div className="text-center mt-10 text-red-500 text-lg font-semibold">
            <p>Account is Banned. Please contact the support team.</p>
          </div>
        </>
      ) : (
        <>
          <Navbar
            data={user}
            onProfileClick={handleProfileView}
            onHomeClick={handleHomeView}
            onMarketClick={handleMarketClick}
          />
          {renderDashboard()}
        </>
      )}
    </div>
  );
}

export default Homepage;