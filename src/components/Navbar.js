import { useEffect, useState } from "react";
import SpecificUser from "../functions/specifecUser";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config"; // Import your Firebase auth instance
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { useNavigate } from "react-router-dom";
import Addrate from "../functions/Rateimport";

const Navbar = ({ data, ontrigger }) => {
  const navigate = useNavigate();
  const [fetcheddata, setfetcheddata] = useState();
  const [showOverlay, setShowOverlay] = useState(false);
  const [agencyInput, setAgencyInput] = useState("");
  const [fetchedd, setfetchdd] = useState();
  const [isConnectedToAgency, setIsConnectedToAgency] = useState(data?.agencyId == ""); // Track if connected to agency
  const [darkMode, setDarkMode] = useState(false); // Manage dark mode state

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
        <div className="flex items-center space-x-6">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              navigate("/Cal");
            }}
            className={`hover:text-blue-500 ${darkMode ? "text-white" : "text-gray-700"}`}
          >
            Home
          </a>
          {data && data.agencyId === "" && data.userType === "client" && !isConnectedToAgency && (
            <button
              onClick={handleconnect}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
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
          {data && <p className={`font-semibold ${darkMode ? "text-white" : "text-gray-700"}`}>Profile</p>}
          {data && (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          )}

          {/* Dark Mode Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`${
              darkMode ? "bg-gray-800" : "bg-gray-300"
            } text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors`}
          >
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>
      </div>
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
