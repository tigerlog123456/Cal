import { useState, useEffect } from "react";
import SpecificUser from "./specifecUser";
import Getrecentdata from "./getrecentdata";

const Agencyclients = ({ data, setClient }) => {
    const [clientData, setClientData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [selectedUid, setSelectedUid] = useState(null);

    // Compute statistics
    const connectedUsers = clientData.length;
    const activeUsers = clientData.filter((client) => client.status === "active").length;

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
        <div className="p-6 dark:bg-gray-900 dark:text-white min-h-screen">
            {/* Fetch client data */}
            <SpecificUser agencyId={data.agencyCode} setfetcheddata={setClientData} />

            <h2 className="text-2xl font-semibold mb-4 text-center">Agency Clients</h2>

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
                    className="w-full md:w-1/2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:border-gray-700 dark:placeholder-gray-400"
                />
                <button
                    onClick={() =>
                        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                    }
                    className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                    Sort: {sortOrder === "asc" ? "Ascending" : "Descending"}
                </button>
            </div>

            {/* Display filtered and sorted data */}
            {filteredData.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-300 dark:border-gray-700 text-center">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800">
                                <th className="border border-gray-300 dark:border-gray-700 p-2">Email</th>
                                <th className="border border-gray-300 dark:border-gray-700 p-2">Full Name</th>
                                <th className="border border-gray-300 dark:border-gray-700 p-2">Age</th>
                                <th className="border border-gray-300 dark:border-gray-700 p-2">Height</th>
                                <th className="border border-gray-300 dark:border-gray-700 p-2">Weight</th>
                                <th className="border border-gray-300 dark:border-gray-700 p-2">Target Weight</th>
                                <th className="border border-gray-300 dark:border-gray-700 p-2">Health Conditions</th>
                                <th className="border border-gray-300 dark:border-gray-700 p-2">Status</th>
                                <th className="border border-gray-300 dark:border-gray-700 p-2">Recent Data</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.map((client, index) => (
                                <tr
                                    key={index}
                                    className={`${
                                        index % 2 === 0
                                            ? "bg-white dark:bg-gray-900"
                                            : "bg-gray-100 dark:bg-gray-800"
                                    }`}
                                >
                                    <td className="border border-gray-300 dark:border-gray-700 p-2">{client.email || "N/A"}</td>
                                    <td className="border border-gray-300 dark:border-gray-700 p-2">{client.fullName || "N/A"}</td>
                                    <td className="border border-gray-300 dark:border-gray-700 p-2">{client.age || "N/A"}</td>
                                    <td className="border border-gray-300 dark:border-gray-700 p-2">{client.height || "N/A"}</td>
                                    <td className="border border-gray-300 dark:border-gray-700 p-2">{client.weight || "N/A"}</td>
                                    <td className="border border-gray-300 dark:border-gray-700 p-2">{client.targetWeight || "N/A"}</td>
                                    <td className="border border-gray-300 dark:border-gray-700 p-2">{client.healthConditions || "N/A"}</td>
                                    <td className="border border-gray-300 dark:border-gray-700 p-2">{client.status || "N/A"}</td>
                                    <td className="border border-gray-300 dark:border-gray-700 p-2">
                                        <button
                                            onClick={() => handleViewClick(client.uid)}
                                            className="p-2 bg-indigo-600 text-white rounded-lg"
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-gray-500 dark:text-gray-400">No matching clients found.</p>
            )}

            {/* Overlay for recent data */}
            {isOverlayVisible && selectedUid && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-4xl w-full dark:bg-gray-800">
                        <button
                            onClick={() => setIsOverlayVisible(false)}
                            className="absolute top-4 right-4 p-2 text-gray-700 dark:text-black bg-gray-200 rounded-full"
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
