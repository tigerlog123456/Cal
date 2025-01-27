import { useState, useEffect } from "react";
import SpecificUser from "./specifecUser";
import Getrecentdata from "./getrecentdata"; // Import Getrecentdata component

const Agencyclients = ({ data }) => {
    const [clientData, setClientData] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);  // For overlay visibility
    const [selectedUid, setSelectedUid] = useState(null);  // Store selected user's UID

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
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {/* Mobile-friendly column layout */}
                        {filteredData.map((client, index) => (
                            <div
                                key={index}
                                className="p-4 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg"
                            >
                                <div className="text-sm font-medium text-center">Email: <span>{client.email || "N/A"}</span></div>
                                <div className="text-sm font-medium text-center">Full Name: <span>{client.fullName || "N/A"}</span></div>
                                <div className="text-sm font-medium text-center">Age: <span>{client.age || "N/A"}</span></div>
                                <div className="text-sm font-medium text-center">Height: <span>{client.height || "N/A"}</span></div>
                                <div className="text-sm font-medium text-center">Weight: <span>{client.weight || "N/A"}</span></div>
                                <div className="text-sm font-medium text-center">Target Weight: <span>{client.targetWeight || "N/A"}</span></div>
                                <div className="text-sm font-medium text-center">Health Conditions: <span>{client.healthConditions || "N/A"}</span></div>
                                <div className="text-sm font-medium text-center">Status: <span>{client.status || "N/A"}</span></div>
                                <div className="text-sm font-medium text-center">
                                <button
                                    onClick={() => handleViewClick(client.uid)}  // Set the UID for fetching recent data
                                    className="mt-4 p-2 bg-indigo-600 text-white rounded-lg text-center"
                                >
                                    View Recent Data
                                </button></div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop table layout */}
                    <table className="table-auto w-full border-collapse border border-gray-300 dark:border-gray-700 hidden md:table text-center">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-800 text-center">
                                <th className="border border-gray-300 dark:border-gray-700 p-2 text-center">Email</th>
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
                                    <td className="border border-gray-300 dark:border-gray-700 p-2 text-center">
                                        {client.email || "N/A"}
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-700 p-2 text-center">
                                        {client.fullName || "N/A"}
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-700 p-2 text-center">
                                        {client.age || "N/A"}
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-700 p-2 text-center">
                                        {client.height || "N/A"}
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-700 p-2 text-center">
                                        {client.weight || "N/A"}
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-700 p-2 text-center">
                                        {client.targetWeight || "N/A"}
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-700 p-2 text-center">
                                        {client.healthConditions || "N/A"}
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-700 p-2 text-center">
                                        {client.status || "N/A"}
                                    </td>
                                    <td className="border border-gray-300 dark:border-gray-700 p-2 text-center">
                                        <button
                                            onClick={() => handleViewClick(client.uid)}  // Trigger the overlay with the selected UID
                                            className="p-2 md:px-8 bg-indigo-600 text-white rounded-lg"
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
