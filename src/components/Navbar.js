import { useEffect, useState } from "react";
import SpecificUser from "../functions/specifecUser";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config"; // Import your Firebase auth instance
import { doc, updateDoc} from "firebase/firestore";
import { db } from "../firebase-config";
import Addrate from "../functions/Rateimport";
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
const Navbar = ({ data , onProfileClick , onHomeClick , onMarketClick}) => {
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
    }
  };

  const handleOverlayClose = () => {
    setShowOverlay(false); // Hide the overlay without submitting
  };

  return (
    <div className={`fixed top-0 left-0 w-full z-50 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"} shadow-md`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-4">
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
           Fitnix
          </Typography>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
        <Button 
          onClick={onHomeClick}
          variant=""
          className={`hover:text-white-500 p-2 rounded-lg transition-colors hover:bg-gray-300 dark:hover:bg-gray-500 ${darkMode ? "text-white" : "text-gray-700"}`}>
            Home
            </Button>
            {data && data.userType === "agency" && <>
            <Button 
          onClick={onMarketClick}
          variant=""
          className={`hover:text-white-500 p-2 rounded-lg transition-colors hover:bg-gray-300 dark:hover:bg-gray-500 ${darkMode ? "text-white" : "text-gray-700"}`}>
            Market
            </Button> </>
            }
          {data && <Button 
          variant=""
          onClick={onProfileClick}
          className={`hover:text-white-500 p-2 rounded-lg transition-colors hover:bg-gray-300 dark:hover:bg-gray-500 ${darkMode ? "text-white" : "text-gray-700"}`}>
            Profile
            </Button>
            }
            {data && data.userType === "agency" && (
               <p className={`
                text-center font-semibold text-sm px-4 py-2 rounded-lg transition-all duration-300
                ${darkMode ? "text-white bg-gray-800 hover:bg-gray-700 shadow-lg shadow-gray-900/30" 
                           : "text-gray-700 bg-gray-100 hover:bg-gray-200 shadow-md shadow-gray-400/20"}
              `}>
                <span className="uppercase tracking-wide text-xs text-gray-500 dark:text-gray-400">
                  Agency Code:
                </span> 
                <span className="ml-2 font-bold text-lg">{data.agencyCode}</span>
              </p>
            )

            }
          {data && data.agencyId === "" && data.userType === "client" && !isConnectedToAgency && (
            <Button
             variant="contained"
              onClick={handleconnect}
              className="bg-blue-500 text-white px-4 py-2  rounded-lg hover:bg-blue-600"
            >
              Connect to Agency
            </Button>
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
                  <Typography className={`font-semibold ${darkMode ? "text-white" : "text-gray-700"}`}>{fetchedd[1].agencyName}</Typography>
                </>
              )}
            </div>
          )}
          {fetchedd && fetchedd.length > 1 && (
            <Addrate data={fetchedd} />
          )}
          
          {data && (
            <Button
              onClick={handleLogout}
              variant="contained"
              color="#FF0000"
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-500 hover:text-white"
            >
              Logout
            </Button>
          )}

          <Button
            onClick={() => setDarkMode(!darkMode)}
            variant="contained"
            color=""
            className={`${
              darkMode ? "bg-gray-800" : "bg-gray-300"
            } text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors`}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>

        {/* Burger Menu for Mobile */}
        <div className="md:hidden">
          <Button
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
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 px-4 py-3 shadow-md gap-4 flex-col flex justify-center">
           <Button 
          variant=""
          onClick={onHomeClick}
          className={`hover:text-white-500 p-2 rounded-lg transition-colors hover:bg-gray-300 dark:hover:bg-gray-500 ${darkMode ? "text-white" : "text-gray-700"}`}>
            Home
            
            </Button>
            {data && data.userType === "agency" && <>
            
            <Button 
            variant=""
          onClick={onMarketClick}
          className={`hover:text-white-500 p-2 rounded-lg transition-colors hover:bg-gray-300 dark:hover:bg-gray-500${darkMode ? "text-white" : "text-gray-700"}`}>
            Market
            
            </Button></>
            }
          {data && <Button 
          variant=""
          onClick={onProfileClick}
          className={`hover:text-white-500 p-2 rounded-lg transition-colors hover:bg-gray-300 dark:hover:bg-gray-500 ${darkMode ? "text-white" : "text-gray-700"}`}>
            Profile
            </Button>}
            {data && data.userType === "agency" && (
                <p className={`
                  text-center font-semibold text-sm px-4 py-2 rounded-lg transition-all duration-300
                  ${darkMode ? "text-white bg-gray-800 hover:bg-gray-700 shadow-lg shadow-gray-900/30" 
                             : "text-gray-700 bg-gray-100 hover:bg-gray-200 shadow-md shadow-gray-400/20"}
                `}>
                  <span className="uppercase tracking-wide text-xs text-gray-500 dark:text-gray-400">
                    Agency Code:
                  </span> 
                  <span className="ml-2 font-bold text-lg">{data.agencyCode}</span>
                </p>
            )
            }
          {data && data.agencyId === "" && data.userType === "client" && !isConnectedToAgency && (
            <Button
            variant="contained"
              onClick={handleconnect}
              className="block w-full bg-blue-500 text-white px-4 py-2 p-2 rounded-lg hover:bg-blue-600 mt-2"
            >
              Connect to Agency
            </Button>
          )}
           {fetchedd && fetchedd.length > 1 && (
                <>
                  <Typography variant="" disabled={true} className={`font-semibold text-center p-2 ${darkMode ? "text-white" : "text-gray-700"}`}>{fetchedd[1].agencyName}</Typography>
                </>
              )}
            {fetchedd && fetchedd.length > 1 && (
            <Addrate data={fetchedd} />
          )}
          {data && (
            <Button
            variant=""
              onClick={handleLogout}
              className="block w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mt-2 hover:text-white"
            >
              Logout
            </Button>
          )}
          <Button
            onClick={() => setDarkMode(!darkMode)}
            variant=""
            className="block w-full bg-gray-300 dark:bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 mt-2"
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </div>
      )}

      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Connect to Agency</h2>
            <input
              placeholder="Agency ID"
              type="text"
              value={agencyInput}
              onChange={(e) => setAgencyInput(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <div className="flex justify-between ">
              <Button
                variant="contained"
                onClick={handleOverlaySubmit}
                className="!bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-red-800 hover:text-white"
              >
                Submit
              </Button>
              <Button
                variant=""
                onClick={handleOverlayClose}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-700"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
