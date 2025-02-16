import { useState, useEffect } from "react";
import { getDocs, query, collection, where } from "firebase/firestore";
import { db } from "../firebase-config";
import Button from '@mui/material/Button';
const Getagencies = ({ darkMode }) => {
  const [agencies, setAllAgencies] = useState([]);
  const [filteredAgencies, setFilteredAgencies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("agencyName"); // Default sorting field
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order
  const [error, setError] = useState(null);
  const [clientrates , setclientrates ] = useState([])
  useEffect(() => {
    const fetchAgenciesData = async () => {
      try {
        // Fetch all agencies first
        const q = query(collection(db, "users"), where("userType", "==", "agency"));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const agenciesData = querySnapshot.docs.map((doc) => doc.data());
          setAllAgencies(agenciesData); // Set agencies data
          setFilteredAgencies(agenciesData); // Initialize filtered data
          // Now, fetch the ratings for each agency from AgencyRate
          await fetchRatesForAgencies(agenciesData);
        } else {
          setError("No agencies found.");
        }
      } catch (err) {
        setError("Failed to fetch agencies data.");
        console.error(err);
      }
    };
    fetchAgenciesData();
  }, []);
  useEffect(() =>{
  },[clientrates])
  const fetchRatesForAgencies = async (agenciesData) => {
    // Fetch and calculate average rate for each agency
    const updatedAgencies = await Promise.all(agenciesData.map(async (agency) => {
      try {
        // Query Firestore for the ratings of this agency
        const rateQuery = query(collection(db, "AgencyRate"), where("agencyId", "==", agency.uid));
        const rateSnapshot = await getDocs(rateQuery);
        if (!rateSnapshot.empty) {
          const rates = rateSnapshot.docs.map(doc => doc.data().rate);
          const ratescount = rateSnapshot.docs.map(doc => doc.data());
          const numericRates = rates.map(rate => parseFloat(rate));
          const averageRate = numericRates.reduce((acc, rate) => acc + rate, 0) / rates.length; /// Calculate average
          agency.averageRate = averageRate; // Add average rate to agency data
          setclientrates(ratescount)
        } else {
          agency.averageRate = 0; // No rates found, set to 0
        }
        return agency;
      } catch (error) {
        console.error("Error fetching rates for agency", agency.uid, error);
        agency.averageRate = 0; // Default to 0 if error occurs
        return agency;
      }
    }));
    setAllAgencies(updatedAgencies); // Update the agencies state with the average rates
    setFilteredAgencies(updatedAgencies); // Also update filtered data
  };

  // Handle search
  useEffect(() => {
    const filtered = agencies.filter((agency) =>
      agency.agencyName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAgencies(filtered);
  }, [searchTerm, agencies , clientrates]);

  // Handle sorting
  const handleSort = (field) => {
    const sorted = [...filteredAgencies].sort((a, b) => {
      if (typeof a[field] === "string") {
        return sortOrder === "asc"
          ? a[field].localeCompare(b[field])
          : b[field].localeCompare(a[field]);
      } else {
        return sortOrder === "asc" ? a[field] - b[field] : b[field] - a[field];
      }
    });
    setFilteredAgencies(sorted);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle sort order
    setSortField(field); // Update the sort field
  };

  return (
    <div className={`p-6 shadow-lg rounded-lg mx-auto max-w-screen-lg dark:bg-gray-900 dark:text-white bg-white text-gray-800`}>
      <h1 className="font-bold text-2xl mb-6 dark:text-white text-gray-800">Top Gyms</h1>
      {error && <p className="text-red-500 font-bold">{error}</p>}
      {/* Sort buttons and search bar */}
      <div className="mb-4 flex flex-col sm:flex-Col justify-between items-center gap-4">
      <input
          type="text"
          placeholder="Search agencies..."
          className={` w-1/2 px-4 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex flex-wrap gap-2">
          <Button
          variant="contained"
            className={`px-3 py-1 rounded text-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white bg-blue-500 hover:bg-blue-600 text-white`}
            onClick={() => handleSort("agencyName")}
          >
            Sort by Name
          </Button>
          <Button
          variant="contained"
            className={`px-3 py-1 rounded text-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white bg-blue-500 hover:bg-blue-600 text-white`}
            onClick={() => handleSort("ownerName")}
          >
            Sort by Owner
          </Button>
          <Button
          variant="contained"
            className={`px-3 py-1 rounded text-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white bg-blue-500 hover:bg-blue-600 text-white`}
            onClick={() => handleSort("location")}
          >
            Sort by Location
          </Button>
          <Button
            variant="contained"
            className={`px-3 py-1 rounded text-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white bg-blue-500 hover:bg-blue-600 text-white`}
            onClick={() => handleSort("price")}
          >
            Sort by Price
          </Button>
          <Button
            variant="contained"
            className={`px-3 py-1 rounded text-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white bg-blue-500 hover:bg-blue-600 text-white`}
            onClick={() => handleSort("averageRate")}
          >
            Sort by Rate
          </Button>
        </div>
      </div>
      {/* Responsive Table */}
      <div className="overflow-y-auto max-h-96 border rounded-lg scrollbar-thin dark:border-gray-700 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 border-gray-200 scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:bg-gray-900 bg-gray-200">
        <div className={`hidden md:flex justify-between p-4 font-semibold dark:bg-gray-700 dark:text-white bg-gray-100 text-gray-600 sticky top-0 `}>
          <div className="w-1/6 text-center">Name</div>
          <div className="w-1/6 text-center">Owner Name</div>
          <div className="w-1/6 text-center">Phone Number</div>
          <div className="w-1/6 text-center">Location</div>
          <div className="w-1/6 text-center">Price</div>
          <div className="w-1/6 text-center">Rate</div>
          <div className="w-1/6 text-center">Reviews</div>
        </div>
        {filteredAgencies && filteredAgencies.length > 0 ? (
          filteredAgencies.map((agency, index) => (
            <div
              key={index}
              className={`flex flex-col rounded-lg md:rounded-sm divide-gray-400 shadow-md mb-4 md:mb-0 md:flex-row justify-between p-4 dark:border-gray-700 dark:bg-gray-800 dark:text-white border-gray-200 bg-white text-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200`}
            >
              <div className="md:w-1/6 divide-gray-700 divide-y text-center">
              <span className="block md:hidden font-semibold">Name:</span>{agency.agencyName}
              </div>
              <div className="md:w-1/6 divide-gray-700 divide-y text-center">
              <span className="block md:hidden font-semibold">Owner Name:</span>{agency.ownerName}
              </div>
              <div className="md:w-1/6 divide-gray-700 divide-y text-center">
              <span className="block md:hidden font-semibold">Phone Number:</span>{agency.phonenumber}
              </div>
              <div className="md:w-1/6 divide-gray-700 divide-y text-center">
              <span className="block md:hidden font-semibold">Location:</span>{agency.location}
              </div>
              <div className="md:w-1/6 divide-gray-700 divide-y text-center">
              <span className="block md:hidden font-semibold">Price:</span>{agency.price} $
              </div>
              <div className="md:w-1/6 divide-gray-700 divide-y text-center">
              <span className="block md:hidden font-semibold">Rate:</span>{agency.averageRate}
              </div>
              <div className="md:w-1/6 divide-gray-700 divide-y text-center">
              <span className="text-sm md:hidden font-semibold">Reviews:</span>
                {(clientrates && clientrates.length > 0 ) ? (
                  <>
                    {(agency.uid == clientrates[0].agencyId ) ? (clientrates.length) : "0" }
                    </>
                ) : (
                  <>0</>
                )}
                </div>
            </div>
          ))
        ) : (
          <p className="text-center font-bold text-red-500 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">No Agencies To Display</p>
        )}
      </div>
    </div>
  );
};

export default Getagencies;
