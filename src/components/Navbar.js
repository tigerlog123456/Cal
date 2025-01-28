import { useEffect, useState } from "react";
import SpecificUser from "../functions/specifecUser";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config"; // Import your Firebase auth instance
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import Addrate from "../functions/Rateimport";

const Navbar = ({ data, ontrigger  , onProfileClick , onHomeClick , onMarketClick}) => {
  const navigate = useNavigate();
  const [fetcheddata, setfetcheddata] = useState();
  const [showOverlay, setShowOverlay] = useState(false);
  const [agencyInput, setAgencyInput] = useState("");
  const [fetchedd, setfetchdd] = useState();
  const [isConnectedToAgency, setIsConnectedToAgency] = useState(data?.agencyId === ""); // Track if connected to agency
  const [darkMode, setDarkMode] = useState(false); // Manage dark mode state
  const [menuOpen, setMenuOpen] = useState(false); // Manage mobile menu state
  useEffect(() => {
    // Add or remove the 'dark' class on the document root based on the darkMode state
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    if (data && fetcheddata) {
      setfetchdd(fetcheddata);
    }
  }, [data, fetcheddata, fetchedd, isConnectedToAgency]);

  const handleLogout = async () => {
    try {
      await signOut(auth); // Logs the user out of Firebase
      window.location.reload();
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleconnect = () => {
    setShowOverlay(true); // Show the overlay when the connect button is clicked
  };

  const handleOverlaySubmit = async () => {
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

  return (
    <div className={`fixed top-0 left-0 w-full z-50 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"} shadow-md`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <p className="text-xl font-bold">Logo</p>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
        <button 
          onClick={onHomeClick}
          className={`hover:text-white-500 p-2 rounded-lg transition-colors hover:bg-gray-500 ${darkMode ? "text-white" : "text-gray-700"}`}>
            Home
            
            </button>
            {data && data.userType === "agency" && <button 
          onClick={onMarketClick}
          className={`hover:text-white-500 p-2 rounded-lg transition-colors hover:bg-gray-500 ${darkMode ? "text-white" : "text-gray-700"}`}>
            Market
            
            </button>
            }
          {data && <button 
          onClick={onProfileClick}
          className={`hover:text-white-500 p-2 rounded-lg transition-colors hover:bg-gray-500 ${darkMode ? "text-white" : "text-gray-700"}`}>
            Profile
            
            </button>
            }
            
          {data && data.agencyId === "" && data.userType === "client" && !isConnectedToAgency && (
            <button
              onClick={handleconnect}
              className="bg-blue-500 text-white px-4 py-2  rounded-lg hover:bg-blue-600"
            >
              Connect to Agency
            </button>
          )}
          {data && data.agencyId !== " " && data.userType === "client" && (
            <div className="flex flex-col">
              <SpecificUser
                agencycode={data.agencyId}
                agencydata={agencyInput}
                data={data.uid}
                setfetcheddata={setfetcheddata}
              />
              {fetchedd && fetchedd.length > 1 && (
                <>
                  <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-700"}`}>{fetchedd[1].agencyName}</p>
                </>
              )}
            </div>
          )}
          {fetchedd && fetchedd.length > 1 && (
            <Addrate data={fetchedd} />
          )}
          
          {data && (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          )}

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`${
              darkMode ? "bg-gray-800" : "bg-gray-300"
            } text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors`}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Burger Menu for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-800 dark:text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-4 py-3 shadow-md gap-4 flex-col flex justify-center">
           <button 
          onClick={onHomeClick}
          className={`hover:text-white-500 p-2 rounded-lg transition-colors hover:bg-gray-500 ${darkMode ? "text-white" : "text-gray-700"}`}>
            Home
            
            </button>
          {data && <button 
          onClick={onProfileClick}
          className={`hover:text-white-500 p-2 rounded-lg transition-colors hover:bg-gray-500 ${darkMode ? "text-white" : "text-gray-700"}`}>
            Profile
            
            </button>}
          {data && data.agencyId === "" && data.userType === "client" && !isConnectedToAgency && (
            <button
              onClick={handleconnect}
              className="block w-full bg-blue-500 text-white px-4 py-2 p-2 rounded-lg hover:bg-blue-600 mt-2"
            >
              Connect to Agency
            </button>
          )}
           {fetchedd && fetchedd.length > 1 && (
                <>
                  <p className={`font-semibold  p-2 ${darkMode ? "text-white" : "text-gray-700"}`}>{fetchedd[1].agencyName}</p>
                </>
              )}
            {fetchedd && fetchedd.length > 1 && (
            <Addrate data={fetchedd} />
          )}
          {data && (
            <button
              onClick={handleLogout}
              className="block w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mt-2"
            >
              Logout
            </button>
          )}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="block w-full bg-gray-300 dark:bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 mt-2"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      )}

      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Connect to Agency</h2>
            <input
              type="text"
              placeholder="Enter Agency ID"
              value={agencyInput}
              onChange={(e) => setAgencyInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <div className="flex justify-between">
              <button
                onClick={handleOverlaySubmit}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Submit
              </button>
              <button
                onClick={handleOverlayClose}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
