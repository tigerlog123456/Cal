import { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, getDocs, query, where, doc, updateDoc, getDoc } from "firebase/firestore";

const Admin = () => {
    const [userCount, setUserCount] = useState(0);
    const [recentDataCount, setRecentDataCount] = useState(0);
    const [transactionsCount, setTransactionCount] = useState(0);
    const [Declinedrequests, setDeclinedrequests] = useState(0);
    const [agencies, setAgencies] = useState([]);
    const [unconnectedUsers, setUnconnectedUsers] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [isRecentDataOverlayVisible, setIsRecentDataOverlayVisible] = useState(false);
    const [clientRecentData, setClientRecentData] = useState(null);
    const [searchQuery, setSearchQuery] = useState(""); // Search query state for filtering
    const [overlaySearchQuery, setOverlaySearchQuery] = useState(""); // Separate search query for overlay
    const [version, setVersion] = useState(0);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const usersSnapshot = await getDocs(collection(db, "users"));
                const recentDataSnapshot = await getDocs(collection(db, "recentData"));
                const transactionSnapshot = await getDocs(collection(db, "Transactions"));
                const DeclinedSnapshot = await getDocs(collection(db, "Declinedrequests"));
                const transactionsSnapshot = await getDocs(collection(db, "transactions"));
                setUserCount(usersSnapshot.size);
                setRecentDataCount(recentDataSnapshot.size);
                setTransactionCount(transactionSnapshot.size);
                setDeclinedrequests(DeclinedSnapshot.size);
                setTransactions(transactionsSnapshot.docs.map(doc => doc.data()));

                const usersData = usersSnapshot.docs.map(doc => doc.data());
                const agencyMap = {};
                const agencyClients = {};

                usersData.forEach(user => {
                    if (user.userType === "agency") {
                        agencyMap[user.agencyCode] = user;
                        agencyClients[user.agencyCode] = [];
                    }
                });

                usersData.forEach(user => {
                    if (user.userType === "client" && user.agencyId && agencyClients[user.agencyId]) {
                        agencyClients[user.agencyId].push(user);
                    }
                });

                setAgencies(Object.values(agencyMap).map(agency => ({
                    ...agency,
                    clients: agencyClients[agency.agencyCode] || []
                })));

                setUnconnectedUsers(usersData.filter(user => user.userType === "client" && !user.agencyId));
            } catch (error) {
                console.error("Error fetching counts:", error);
            }
        };

        fetchCounts();
    }, [version]);

    const fetchClientRecentData = async (clientId) => {
        try {
            const q = query(collection(db, "recentData"), where("uid", "==", clientId));
            const snapshot = await getDocs(q);
            setClientRecentData(snapshot.docs.map(doc => doc.data()));
            setIsRecentDataOverlayVisible(true);  // Show the recent data overlay when data is fetched
        } catch (error) {
            console.error("Error fetching recent data:", error);
        }
    };

    const handleViewClients = (clients) => {
        setSelectedClients(clients);
        setIsOverlayVisible(true);
    };

    const handleStatus = async (userId, currentStatus) => {
        if (!userId) {
            console.error("Error: userId is undefined", userId);
            return;
        }

        try {
            const newStatus = currentStatus === "Active" ? "Inactive" : "Active"; // Capitalized

            // Optimistic update (update UI before Firestore)
            setAgencies(prevAgencies =>
                prevAgencies.map(agency =>
                    agency.uid === userId ? { ...agency, status: newStatus } : agency
                )
            );

            setSelectedClients(prevClients =>
                prevClients.map(client =>
                    client.uid === userId ? { ...client, status: newStatus } : client
                )
            );

            setVersion(prev => prev + 1);

            // Firestore update
            const userRef = doc(db, "users", userId);
            await updateDoc(userRef, { status: newStatus });

        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const handleShowRecentData = (clientId) => {
        fetchClientRecentData(clientId);
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value); // Update search query state on input change
    };

    const handleOverlaySearchChange = (event) => {
        setOverlaySearchQuery(event.target.value); // Update overlay search query state on input change
    };

    // Filter agencies and clients based on search query
    const filteredAgencies = agencies.filter((agency) =>
        agency.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agency.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agency.agencyCode.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredClients = selectedClients.filter((client) =>
        client.fullName.toLowerCase().includes(overlaySearchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(overlaySearchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col items-center min-h-screen bg-white dark:bg-gray-900 p-4 md:mt-16 mt-10">
            {/* Dashboard Count Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl mb-8">
                {[{
                    title: "Users",
                    count: userCount
                }, {
                    title: "Recent Data",
                    count: recentDataCount
                }, {
                    title: "Transactions",
                    count: transactionsCount
                }, {
                    title: "Declined Requests",
                    count: Declinedrequests
                }, {
                    title:"Unconnected Users",
                    count:unconnectedUsers.length
                }
                
            ].map((item, index) => (
                    <div key={index} className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white p-4 rounded-lg shadow-md text-center flex flex-col items-center justify-center h-24">
                        <h2 className="text-lg font-semibold">{item.title}</h2>
                        <p className="text-2xl font-bold">{item.count}</p>
                    </div>
                ))}
            </div>

            {/* Agencies and Clients Section */}
            <div className="w-full max-w-6xl">
                <h2 className="text-xl font-bold mb-2 dark:text-white">Agencies and Clients</h2>

                {/* Search Bar */}
                <div className="mb-4 w-full max-w-lg">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search Agencies and Clients"
                        className="w-full p-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-md"
                    />
                </div>

                {/* Table View for Desktop */}
                <div className="overflow-x-auto max-h-[400px] dark:bg-gray-800 rounded-lg shadow-md hidden sm:block">
                    <table className="w-full table-auto dark:text-white">
                        <thead className="bg-gray-200 dark:bg-gray-700">
                            <tr>
                                <th className="border-b border-gray-300 p-2 text-center">Agency Name</th>
                                <th className="border-b border-gray-300 p-2 text-center">Owner</th>
                                <th className="border-b border-gray-300 p-2 text-center">Agency Code</th>
                                <th className="border-b border-gray-300 p-2 text-center">Email</th>
                                <th className="border-b border-gray-300 p-2 text-center">Status</th>
                                <th className="border-b border-gray-300 p-2 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAgencies.map((agency, index) => (
                                <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <td className="border-b border-gray-300 p-2 text-center">{agency.agencyName}</td>
                                    <td className="border-b border-gray-300 p-2 text-center">{agency.ownerName}</td>
                                    <td className="border-b border-gray-300 p-2 text-center">{agency.agencyCode}</td>
                                    <td className="border-b border-gray-300 p-2 text-center">{agency.email}</td>
                                    <td className="border-b border-gray-300 p-2 text-center">{agency.status}</td>
                                    <td className="border-b border-gray-300 p-2 flex flex-row text-center justify-around">
                                        <button className="bg-blue-500  text-white px-2 py-1 rounded" onClick={() => handleViewClients(agency.clients)}>
                                            View Clients
                                        </button>
                                        <button
                                            className={`px-3 py-1 rounded-md ml-4 ${
                                                agency.status === "Active" ? "bg-red-500" : "bg-green-500"
                                            } text-white`}
                                            onClick={() => handleStatus(agency.uid, agency.status)}
                                        >
                                            {agency.status === "Active" ? "Inactive" : "Active"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Card View for Mobile */}
                <div className="sm:hidden flex flex-wrap gap-4 overflow-y-auto max-h-[80vh]" >
                    {filteredAgencies.map((agency, index) => (
                        <div key={index} className="bg-gray-200 dark:bg-gray-800 text-black dark:text-white p-4 rounded-lg shadow-md w-full max-w-sm ">
                            <h3 className="font-semibold text-lg">{agency.agencyName}</h3>
                            <p><strong>Owner:</strong> {agency.ownerName}</p>
                            <p><strong>Agency Code:</strong> {agency.agencyCode}</p>
                            <p><strong>Email:</strong> {agency.email}</p>
                            <p><strong>Status:</strong> {agency.status}</p>
                            <div className="mt-2">
                                <button
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleViewClients(agency.clients)}
                                >
                                    View Clients
                                </button>
                                <button
                                    className={`px-3 py-1 rounded-md ml-4 ${
                                        agency.status === "Active" ? "bg-red-500" : "bg-green-500"
                                    } text-white`}
                                    onClick={() => handleStatus(agency.uid, agency.status)}
                                >
                                    {agency.status === "Active" ? "Inactive" : "Active"}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Overlay for Clients */}
            {isOverlayVisible && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-lg sm:max-w-full w-full dark:bg-gray-800 overflow-y-auto max-h-[80vh]">
                        <button
                            onClick={() => setIsOverlayVisible(false)}
                            className="absolute top-4 right-4 p-2 text-gray-700 dark:text-black bg-gray-200 rounded-full"
                        >
                            X
                        </button>
                        <h2 className="text-xl font-bold mb-4 dark:text-white">Clients</h2>

                        {/* Search Bar for Clients */}
                        <div className="mb-4 w-full max-w-lg">
                            <input
                                type="text"
                                value={overlaySearchQuery}
                                onChange={handleOverlaySearchChange}
                                placeholder="Search Clients"
                                className="w-full p-2 bg-gray-200 dark:bg-gray-800 text-black dark:text-white rounded-lg shadow-md"
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:hidden dark:text-white">
                            {filteredClients.map((client, index) => (
                                <div key={index} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
                                    <p className="text-lg font-bold">{client.fullName}</p>
                                    <p>Email: {client.email}</p>
                                    <p>Age: {client.age}</p>
                                    <p>Weight: {client.weight}</p>
                                    <p>Height: {client.height}</p>
                                    <p>Target Weight: {client.targetWeight}</p>
                                    <p>Health Conditions: {client.healthConditions}</p>
                                    <p>Status: {client.status}</p>
                                    <button
                                        className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                                        onClick={() => fetchClientRecentData(client.uid)}
                                    >
                                        Show Recent Data
                                    </button>
                                    <button
                                        className={`px-3 py-1 rounded-md ml-4 ${
                                            client.status === "Active" ? "bg-red-500" : "bg-green-500"
                                        } text-white`}
                                        onClick={() => handleStatus(client.uid, client.status)}
                                    >
                                        {client.status === "Active" ? "Inactive" : "Active"}
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="hidden sm:block overflow-x-auto max-h-[400px] dark:bg-gray-800 rounded-lg shadow-md">
                            <table className="w-full table-auto dark:text-white">
                                <thead className="bg-gray-200 dark:bg-gray-700">
                                    <tr>
                                        <th className="border-b p-2 text-center">Client Name</th>
                                        <th className="border-b p-2 text-center">Email</th>
                                        <th className="border-b p-2 text-center">Age</th>
                                        <th className="border-b p-2 text-center">Weight</th>
                                        <th className="border-b p-2 text-center">Height</th>
                                        <th className="border-b p-2 text-center">Target Weight</th>
                                        <th className="border-b p-2 text-center">Health Conditions</th>
                                        <th className="border-b p-2 text-center">Status</th>
                                        <th className="border-b p-2 text-center">Recent Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClients.map((client, index) => (
                                        <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                            <td className="border-b p-2 text-center">{client.fullName}</td>
                                            <td className="border-b p-2 text-center">{client.email}</td>
                                            <td className="border-b p-2 text-center">{client.age}</td>
                                            <td className="border-b p-2 text-center">{client.weight}</td>
                                            <td className="border-b p-2 text-center">{client.height}</td>
                                            <td className="border-b p-2 text-center">{client.targetWeight}</td>
                                            <td className="border-b p-2 text-center">{client.healthConditions}</td>
                                            <td className="border-b p-2 text-center">{client.status}</td>
                                            <td className="border-b p-2 text-center">
                                                <button
                                                    className="bg-blue-500 text-white px-2 py-1 rounded"
                                                    onClick={() => fetchClientRecentData(client.uid)}
                                                >
                                                    Show Recent Data
                                                </button>
                                                <button
                                        className={`px-3 py-1 rounded-md ml-4 ${
                                            client.status === "Active" ? "bg-red-500" : "bg-green-500"
                                        } text-white`}
                                        onClick={() => handleStatus(client.uid, client.status)}
                                    >
                                        {client.status === "Active" ? "Inactive" : "Active"}
                                    </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Overlay for Recent Data */}
            {isRecentDataOverlayVisible && clientRecentData && (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-xs sm:max-w-4xl w-full dark:bg-gray-800 overflow-y-auto max-h-[80vh] dark:text-white">
            <button
                onClick={() => setIsRecentDataOverlayVisible(false)}
                className="absolute top-4 right-4 p-2 text-gray-700 dark:text-black bg-gray-200 rounded-full"
            >
                X
            </button>
            <h2 className="text-xl font-bold mb-4">Recent Data</h2>

            {/* Card View for Mobile */}
            <div className="sm:hidden grid grid-cols-1 gap-4">
                {clientRecentData.map((data, index) => (
                    <div key={index} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
                        <p className="text-lg font-bold">Timestamp: {new Date(data.timestamp.seconds * 1000).toLocaleString()}</p>
                        <p><strong>Today's Weight:</strong> {data.todayWeight}</p>
                        <p><strong>Steps:</strong> {data.steps}</p>
                        <p><strong>Water (L):</strong> {data.water}</p>
                        <p><strong>Calories Burned:</strong> {data.caloriesburned}</p>
                        <p><strong>Calories Needed:</strong> {data.caloriesneeded}</p>
                    </div>
                ))}
            </div>

            {/* Table View for Desktop */}
            <div className="hidden sm:block overflow-x-auto max-h-[400px] dark:bg-gray-800 rounded-lg shadow-md">
                <table className="w-full table-auto dark:text-white">
                    <thead className="bg-gray-200 dark:bg-gray-700">
                        <tr>
                            <th className="border-b border-gray-300 p-2 text-center">Timestamp</th>
                            <th className="border-b border-gray-300 p-2 text-center">Today Weight</th>
                            <th className="border-b border-gray-300 p-2 text-center">Steps</th>
                            <th className="border-b border-gray-300 p-2 text-center">Water (L)</th>
                            <th className="border-b border-gray-300 p-2 text-center">Calories Burned</th>
                            <th className="border-b border-gray-300 p-2 text-center">Calories Needed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientRecentData.map((data, index) => (
                            <tr key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700">
                                <td className="border-b border-gray-300 p-2 text-center">{new Date(data.timestamp.seconds * 1000).toLocaleString()}</td>
                                <td className="border-b border-gray-300 p-2 text-center">{data.todayWeight}</td>
                                <td className="border-b border-gray-300 p-2 text-center">{data.steps}</td>
                                <td className="border-b border-gray-300 p-2 text-center">{data.water}</td>
                                <td className="border-b border-gray-300 p-2 text-center">{data.caloriesburned}</td>
                                <td className="border-b border-gray-300 p-2 text-center">{data.caloriesneeded}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
)}
        </div>
    );
};

export default Admin;