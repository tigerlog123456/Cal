import { useState, useEffect } from "react";
import { getDocs, query, collection, where } from "firebase/firestore";
import { db } from "../firebase-config";

const Getagencies = () => {
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
    <div className="p-4 bg-white shadow-lg rounded-lg  mx-auto">
  <h1 className="text-xl font-bold">Top Gyms</h1>
  {error && <p>{error}</p>}

  {/* Sort buttons at the top */}
  <div className="mb-4 flex justify-between items-center">
    <div className="flex space-x-2">
      <button
        className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
        onClick={() => handleSort("agencyName")}
      >
        Sort by Name
      </button>
      <button
        className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
        onClick={() => handleSort("ownerName")}
      >
        Sort by Owner
      </button>
      <button
        className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
        onClick={() => handleSort("location")}
      >
        Sort by Location
      </button>
      <button
        className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
        onClick={() => handleSort("price")}
      >
        Sort by Price
      </button>
      <button
        className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
        onClick={() => handleSort("averageRate")}
      >
        Sort by Rate
      </button>
    </div>
    <input
      type="text"
      placeholder="Search agencies..."
      className="p-2 border rounded w-1/4"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  </div>

  {/* Table headers with background color */}
  <div className="overflow-x-auto mb-6">
    <div className="flex justify-between p-2 font-bold border-b bg-gray-100">
      <div className="w-1/6">Name</div>
      <div className="w-1/6">Owner Name</div>
      <div className="w-1/6">Phone Number</div>
      <div className="w-1/6">Location</div>
      <div className="w-1/6">Price</div>
      <div className="w-1/6">Rate</div>
    </div>

    {/* Table rows with background and hover effect */}
    {filteredAgencies && filteredAgencies.length > 0 ? (
      filteredAgencies.map((agency, index) => (
        <div
          key={index}
          className="flex justify-between p-2 border-b bg-white hover:bg-gray-50"
        >
          <div className="w-1/6">{agency.agencyName}</div>
          <div className="w-1/6">{agency.ownerName}</div>
          <div className="w-1/6">{agency.phonenumber}</div>
          <div className="w-1/6">{agency.location}</div>
          <div className="w-1/6">{agency.price}</div>
          <div className="w-1/6">{agency.averageRate}</div>
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
