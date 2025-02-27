import { useState } from "react";
import SpecificUser from "./specifecUser";
import Getrecentdata from "./getrecentdata";
import Button from '@mui/material/Button';
const Agencyclients = ({ data }) => {
    const [clientData, setClientData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [selectedUid, setSelectedUid] = useState(null);
    // Compute statistics
    const connectedUsers = clientData.length;
    const activeUsers = clientData.filter((client) => client.status === "Active").length;
    const validWeights = clientData
    .map((client) => parseFloat(client.weight)) // Convert weights to numbers
    .filter((weight) => !isNaN(weight) && weight > 0); 
    const averageWeight =
    validWeights.length > 0
        ? (validWeights.reduce((sum, weight) => sum + weight, 0) / validWeights.length).toFixed(1)
        : "N/A";

    // Filter and sort logic
    const filteredData = clientData
        .filter((client) =>
            client.email.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .sort((a, b) => {
            const comparison = a.email.localeCompare(b.email);
            return sortOrder === "asc" ? comparison : -comparison;
        });

    // Show overlay with recent data when "View" button is clicked
    const handleViewClick = (uid) => {
        setSelectedUid(uid);
        setIsOverlayVisible(true);
    };

    return (
        <div className="p-6 dark:bg-gray-900 dark:text-white h-auto ">
            {/* Fetch client data */}
            <SpecificUser agencyId={data.agencyCode} setfetcheddata={setClientData} />
            <h2 className="text-2xl font-semibold mb-4 text-center mt-14 ">Agency Clients</h2>
            {/* Statistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-indigo-600 text-white rounded-lg shadow-lg text-center">
                    <h3 className="text-lg font-semibold">Connected Users</h3>
                    <p className="text-3xl font-bold">{connectedUsers}</p>
                </div>
                <div className="p-4 bg-green-600 text-white rounded-lg shadow-lg text-center">
                    <h3 className="text-lg font-semibold">Active Users</h3>
                    <p className="text-3xl font-bold">{activeUsers}</p>
                </div>
                <div className="p-4 bg-blue-600 text-white rounded-lg shadow-lg text-center">
                    <h3 className="text-lg font-semibold">Average Weight</h3>
                    <p className="text-3xl font-bold">{averageWeight}</p>
                </div>
            </div>
            {/* Search and Filter Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <input
                    type="text"
                    placeholder="Search by email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400"
                />
                <Button
                variant="contained"
                    onClick={() =>
                        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                    }
                    className="p-2 bg-indigo-600 text-white !hover:bg-blue-700 rounded-lg transition duration-200 dark:bg-blue-500 dark:hover:bg-blue-600">
                    Sort: {sortOrder === "asc" ? "Ascending" : "Descending"}
                </Button>
            </div>

            {/* Display filtered and sorted data */}
            {filteredData.length > 0 ? (
  <>
    {/* Card View for Mobile and Small Screens */}
    <div className="max-h-96 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:hidden gap-4">
      {filteredData.map((client, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md p-4"
        >
          <div className="text-center">
            <h3 className="font-semibold text-lg">{client.fullName || "N/A"}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{client.email || "N/A"}</p>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm"><strong>Age:</strong> {client.age || "N/A"}</p>
            <p className="text-sm"><strong>Height:</strong> {client.height || "N/A"}</p>
            <p className="text-sm"><strong>Weight:</strong> {client.weight || "N/A"}</p>
            <p className="text-sm"><strong>Target Weight:</strong> {client.targetWeight || "N/A"}</p>
            <p className="text-sm"><strong>Health Conditions:</strong> {client.healthConditions || "N/A"}</p>
            <p className={(client.status == "Active")? "text-green-500 font-bold text-sm" : "text-red-500 font-bold text-sm" }><strong>Status:</strong> {client.status || "N/A"}</p>
          </div>
          <div className="mt-4 text-center">
            <Button
              variant="contained"
              onClick={() => handleViewClick(client.uid)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-all duration-200"
            >
              View Recent Data
            </Button>
          </div>
        </div>
      ))}
    </div>

   {/* Table View for Medium Screens and Larger */}
<div className="hidden md:block max-h-96 overflow-y-auto">
  <table className="table-auto w-full border-separate border-spacing-0 shadow-lg rounded-lg overflow-hidden">
    <thead className="bg-gray-100 text-black dark:bg-gray-700 dark:text-white bg-gray-100 text-gray-600">
      <tr>
        <th className="p-4 text-center">Email</th>
        <th className="p-4 text-center">Full Name</th>
        <th className="p-4 text-center">Age</th>
        <th className="p-4 text-center">Height</th>
        <th className="p-4 text-center">Weight</th>
        <th className="p-4 text-center">Target Weight</th>
        <th className="p-4 text-center">Health Conditions</th>
        <th className="p-4 text-center">Status</th>
        <th className="p-4 text-center">Recent Data</th>
      </tr>
    </thead>
    <tbody>
      {filteredData.map((client, index) => (
        <tr
          key={index}
          className={`dark:bg-gray-800 rounded-lg md:rounded-sm divide-gray-400 shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200`}
        >
          <td className="p-4 text-center">{client.email || "N/A"}</td>
          <td className="p-4 text-center">{client.fullName || "N/A"}</td>
          <td className="p-4 text-center">{client.age || "N/A"}</td>
          <td className="p-4 text-center">{client.height || "N/A"}</td>
          <td className="p-4 text-center">{client.weight || "N/A"}</td>
          <td className="p-4 text-center">{client.targetWeight || "N/A"}</td>
          <td className="p-4 text-center">{client.healthConditions || "N/A"}</td>
          <td className={(client.status == "Active")? "text-green-500 font-bold p-4 text-center" : "text-red-500 font-bold p-4 text-center" }>{client.status || "N/A"}</td>
          <td className="p-4 text-center">
            <Button
              variant="contained"
              onClick={() => handleViewClick(client.uid)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-all duration-200"
            >
              View
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

  </>
) : (
  <p className=" text-center font-bold text-red-500 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">No Client Available</p>
)}

            {/* Overlay for recent data */}
            {isOverlayVisible && selectedUid && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-4xl w-full dark:bg-gray-800">
                        <button
                            onClick={() => setIsOverlayVisible(false)}
                            className="absolute top-4 right-4 w-8 h-8 bg-red-500 text-gray-700 dark:text-black bg-gray-200 rounded-full"
                        >
                            X
                        </button>
                        <Getrecentdata data={{ uid: selectedUid }} refreshKey={selectedUid} Setrecent={() => {}} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Agencyclients;
