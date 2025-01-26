import { useState, useEffect } from "react";
import { getDocs, query, collection, where } from "firebase/firestore";
import { db } from "../firebase-config";

const Getagencies = ({ darkMode }) => {
  const [agencies, setAllAgencies] = useState([]);
  const [filteredAgencies, setFilteredAgencies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("agencyName"); // Default sorting field
  const [sortOrder, setSortOrder] = useState("asc"); // Default sorting order
  const [error, setError] = useState(null);

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

  const fetchRatesForAgencies = async (agenciesData) => {
    // Fetch and calculate average rate for each agency
    const updatedAgencies = await Promise.all(agenciesData.map(async (agency) => {
      try {
        // Query Firestore for the ratings of this agency
        const rateQuery = query(collection(db, "AgencyRate"), where("agencyId", "==", agency.uid));
        const rateSnapshot = await getDocs(rateQuery);

        if (!rateSnapshot.empty) {
          const rates = rateSnapshot.docs.map(doc => doc.data().rate);
          const numericRates = rates.map(rate => parseFloat(rate));
          const averageRate = numericRates.reduce((acc, rate) => acc + rate, 0) / rates.length; /// Calculate average
          agency.averageRate = averageRate; // Add average rate to agency data
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
  }, [searchTerm, agencies]);

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
    <div className={`p-4 shadow-lg rounded-lg mx-auto max-w-screen-lg dark:bg-gray-900 dark:text-white bg-white text-gray-800`}>
      <h1 className="text-xl font-bold mb-4">Top Gyms</h1>
      {error && <p>{error}</p>}

      {/* Sort buttons and search bar */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 rounded text-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white bg-blue-500 hover:bg-blue-600 text-white`}
            onClick={() => handleSort("agencyName")}
          >
            Sort by Name
          </button>
          <button
            className={`px-3 py-1 rounded text-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white bg-blue-500 hover:bg-blue-600 text-white`}
            onClick={() => handleSort("ownerName")}
          >
            Sort by Owner
          </button>
          <button
            className={`px-3 py-1 rounded text-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white bg-blue-500 hover:bg-blue-600 text-white`}
            onClick={() => handleSort("location")}
          >
            Sort by Location
          </button>
          <button
            className={`px-3 py-1 rounded text-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white bg-blue-500 hover:bg-blue-600 text-white`}
            onClick={() => handleSort("price")}
          >
            Sort by Price
          </button>
          <button
            className={`px-3 py-1 rounded text-sm dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white bg-blue-500 hover:bg-blue-600 text-white`}
            onClick={() => handleSort("averageRate")}
          >
            Sort by Rate
          </button>
        </div>
        <input
          type="text"
          placeholder="Search agencies..."
          className={`p-2 border rounded w-full sm:w-1/3 dark:bg-gray-800 dark:border-gray-700 dark:text-white bg-white border-gray-300 text-gray-800`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <div className={`min-w-full font-bold text-gray-600 hidden sm:grid grid-cols-6 p-2 dark:bg-gray-800 dark:text-white bg-gray-100 `}>
          <div>Name</div>
          <div>Owner Name</div>
          <div>Phone Number</div>
          <div>Location</div>
          <div>Price</div>
          <div>Rate</div>
        </div>

        {filteredAgencies && filteredAgencies.length > 0 ? (
          filteredAgencies.map((agency, index) => (
            <div
              key={index}
              className={`grid sm:grid-cols-6 grid-cols-1 gap-4 p-2 border-b dark:bg-gray-900 dark:hover:bg-gray-800 dark:text-white dark:border-gray-700 bg-white hover:bg-gray-50 text-gray-800 border-gray-200 `}
            >
              <div className="font-semibold sm:hidden">Name:</div>
              <div>{agency.agencyName}</div>
              <div className="font-semibold sm:hidden">Owner Name:</div>
              <div>{agency.ownerName}</div>
              <div className="font-semibold sm:hidden">Phone Number:</div>
              <div>{agency.phonenumber}</div>
              <div className="font-semibold sm:hidden">Location:</div>
              <div>{agency.location}</div>
              <div className="font-semibold sm:hidden">Price:</div>
              <div>{agency.price}</div>
              <div className="font-semibold sm:hidden">Rate:</div>
              <div>{agency.averageRate}</div>
            </div>
          ))
        ) : (
          <p>No agencies to display.</p>
        )}
      </div>
    </div>
  );
};

export default Getagencies;
