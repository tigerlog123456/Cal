import { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import Button from '@mui/material/Button';
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
    const [Inactiveuserstatuscount , setinactiveuserstatuscount] = useState("")
    const [activeusercount , setactiveusercount] = useState("")
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
                let activeCount = 0;
                let inactiveCount = 0;
                
                usersData.forEach(user => {
                    if (user.status === "Inactive") {
                        inactiveCount++;
                    } else if (user.status === "Active") {
                        activeCount++;
                    }
                });
                
                setinactiveuserstatuscount(inactiveCount);
                setactiveusercount(activeCount);
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
    }, [version ]);

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
    const formatDate = (timestamp) => {
        if (!timestamp) return ""; // Handle undefined timestamps
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).replace(",", "");
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
        <div className="flex flex-col items-center min-h-screen bg-white dark:bg-gray-900 p-4 dark:text-white">
            {/* Dashboard Count Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-4xl mb-8 md:mt-16 mt-16">
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
                    title:" Unconnected Users",
                    count:unconnectedUsers.length
                },
                {
                    title:" Active Users",
                    count:activeusercount
                },
                {
                    title:" Inactive Users",
                    count:Inactiveuserstatuscount
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
                <div className="hidden md:block max-h-96 overflow-y-auto">
                    <table className="table-auto w-full border-separate border-spacing-0 shadow-lg rounded-lg overflow-hidden">
                        <thead className="bg-gray-100 text-black dark:bg-gray-700 dark:text-white bg-gray-100 text-gray-600">
                            <tr>
                                <th className="p-4 text-center font-bold">Agency Name</th>
                                <th className="p-4 text-center font-bold">Owner</th>
                                <th className="p-4 text-center font-bold">Email</th>
                                <th className="p-4 text-center font-boldr">Agency Code</th>
                                <th className="p-4 text-center font-bold">Participants</th>
                                <td className="p-4 text-center font-bold">Rate</td>
                                <th className="p-4 text-center font-bold">Status</th>
                                <th className="p-4 text-center font-bold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(filteredAgencies && filteredAgencies.length > 0) ? (
                                filteredAgencies.map((agency, index) => (
                                    <tr key={index} className="dark:bg-gray-800 rounded-lg md:rounded-sm divide-gray-400 shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200">
                                        <td className="p-4 text-center">{agency.agencyName}</td>
                                        <td className="p-4 text-center">{agency.ownerName}</td>
                                        <td className="p-4 text-center">{agency.email}</td>
                                        <td className="p-4 text-center">{agency.agencyCode}</td>
                                        <td className="p-4 text-center">{agency.clients.length}</td>
                                        <td className="p-4 text-center">{agency.rate}</td>
                                        <td className={(agency.status == "Active")? "text-green-500 font-bold p-4 text-center" : "text-red-500 font-bold p-4 text-center" }>{agency.status || "N/A"}</td>
                                        <td className="p-4 text-center flex flex-row justify-around gap-2">
                                            <Button variant="contained" className="bg-blue-500  text-white px-2 py-1 rounded" onClick={() => handleViewClients(agency.clients)}>
                                                View Clients
                                            </Button>
                                            <Button
                                                variant="contained"
                                                className={`px-3 py-1 rounded-md ml-4 ${
                                                    agency.status === "Active" ? "!bg-red-500" : "!bg-green-500"
                                                } text-white`}
                                                onClick={() => handleStatus(agency.uid, agency.status)}
                                            >
                                                {agency.status === "Active" ? "Inactive" : "Active"}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="100%" className=" text-center font-bold text-red-500 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">No Agencies Available</td>
                                </tr>
                            ) }

                        </tbody>
                    </table>
                </div>

                {/* Card View for Mobile */}
                <div className="max-h-96 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:hidden gap-4" >
                    {(filteredAgencies && filteredAgencies.length >0)? (
                        filteredAgencies.map((agency, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md p-4 ">
                                <div className="text-center">
                                 <h3 className="font-semibold text-lg">{agency.agencyName || "N/A"}</h3>
                                 <p className="text-sm text-gray-500 dark:text-gray-400"><strong>Email:</strong> {agency.email || "N/A"}</p>
                                </div>
                                <div className="mt-4 text-center">
                                <p className="text-sm"><strong>Owner:</strong> {agency.ownerName}</p>
                                <p className="text-sm"><strong>Agency Code:</strong> {agency.agencyCode}</p>
                                <p className="text-sm"><strong>Participants:</strong> {agency.clients.length}</p>
                                <p className="text-sm"><strong>Rate:</strong> {agency.rate}</p>
                                <p className={(agency.status == "Active")? "text-green-500 font-bold text-sm" : "text-red-500 font-bold text-sm" }><strong>Status:</strong> {agency.status || "N/A"}</p>
                                </div>
                                <div className="mt-2 text-center flex flex-row gap-2 justify-center">
                                    <Button
                                        variant="contained"
                                        className="bg-blue-500 text-white px-4 py-2 rounded"
                                        onClick={() => handleViewClients(agency.clients)}
                                    >
                                        View Clients
                                    </Button>
                                    <Button
                                        variant="contained"
                                        className={`px-3 py-1 rounded-md ml-4 ${
                                            agency.status === "Active" ? "!bg-red-500" : "!bg-green-500"
                                        } text-white`}
                                        onClick={() => handleStatus(agency.uid, agency.status)}
                                    >
                                        {agency.status === "Active" ? "Inactive" : "Active"}
                                    </Button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center font-bold text-red-500 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">No Agencies Available</p>
                    )}
                </div>
            </div>

            {/* Overlay for Clients */}
            {isOverlayVisible && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-lg sm:max-w-full w-full dark:bg-gray-800 overflow-y-auto max-h-[80vh]">
                        <button
                            onClick={() => setIsOverlayVisible(false)}
                            className="absolute top-4 right-4 w-8 h-8 bg-red-500 text-gray-700 dark:text-black bg-gray-200 rounded-full"
                        >
                            X
                        </button>
                        <h2 className="text-xl font-bold mb-2 dark:text-white">Clients</h2>

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
                        <div className="max-h-96 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:hidden gap-4">
                            {(filteredClients && filteredClients.length > 0)? (
                                filteredClients.map((client, index) => (
                                    <div key={index} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md p-4">
                                        <div className="text-center">
                                     <h3 className="font-semibold text-lg">{client.fullName || "N/A"}</h3>
                                     <p className="text-sm text-gray-500 dark:text-gray-400"><strong>Email:</strong> {client.email || "N/A"}</p>
                                    </div>
                                    <div className="mt-4 text-center">
                                        <p className="text-sm">Age: {client.age}</p>
                                        <p className="text-sm">Weight: {client.weight}</p>
                                        <p className="text-sm">Height: {client.height}</p>
                                        <p className="text-sm">Target Weight: {client.targetWeight}</p>
                                        <p className="text-sm">Health Conditions: {client.healthConditions}</p>
                                        <p className={(client.status == "Active")? "text-green-500 font-bold text-sm" : "text-red-500 font-bold text-sm" }><strong>Status:</strong> {client.status || "N/A"}</p>
                                   </div>
                                        <div className="mt-2 text-center flex flex-row gap-2 justify-center">
                                        <Button
                                            variant="contained"
                                            className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
                                            onClick={() => fetchClientRecentData(client.uid)}
                                        >
                                            Show Recent Data
                                        </Button>
                                        <Button
                                            variant="contained"
                                            className={`px-3 py-1 rounded-md ml-4 ${
                                                client.status === "Active" ? "!bg-red-500" : "!bg-green-500"
                                            } text-white`}
                                            onClick={() => handleStatus(client.uid, client.status)}
                                        >
                                            {client.status === "Active" ? "Inactive" : "Active"}
                                        </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center font-bold text-red-500 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">No Clients Available</p>
                            ) }
                        </div>
                        <div className="hidden md:block max-h-96 overflow-y-auto">
                            <table className="table-auto w-full border-separate border-spacing-0 shadow-lg rounded-lg overflow-hidden">
                                <thead className="bg-gray-100 text-black dark:bg-gray-700 dark:text-white bg-gray-100 text-gray-600">
                                    <tr>
                                        <th className="p-4 text-center">Client Name</th>
                                        <th className="p-4 text-center">Email</th>
                                        <th className="p-4 text-center">Age</th>
                                        <th className="p-4 text-center">Weight</th>
                                        <th className="p-4 text-center">Height</th>
                                        <th className="p-4 text-center">Target Weight</th>
                                        <th className="p-4 text-center">Health Conditions</th>
                                        <th className="p-4 text-center">Status</th>
                                        <th className="p-4 text-center">Recent Data</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(filteredClients && filteredClients.length > 0 ) ? (
                                        filteredClients.map((client, index) => (
                                            <tr key={index} className="dark:bg-gray-800 rounded-lg md:rounded-sm divide-gray-400 shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200">
                                                <td className="p-4 text-center">{client.fullName}</td>
                                                <td className="p-4 text-center">{client.email}</td>
                                                <td className="p-4 text-center">{client.age}</td>
                                                <td className="p-4 text-center">{client.weight}</td>
                                                <td className="p-4 text-center">{client.height}</td>
                                                <td className="p-4 text-center">{client.targetWeight}</td>
                                                <td className="p-4 text-center">{client.healthConditions}</td>
                                                <td className={(client.status == "Active")? "text-green-500 font-bold p-4 text-center" : "text-red-500 font-bold p-4 text-center" }>{client.status || "N/A"}</td>
                                                <td className="p-4 text-center">
                                                    <div className="text-center flex flex-row gap-2 justify-around">
                                                    <Button
                                                    variant="contained"
                                                    className="bg-blue-500 text-white px-2 py-1 rounded"
                                                    onClick={() => fetchClientRecentData(client.uid)}
                                                    >
                                                        Show Recent Data
                                                    </Button>
                                                    <Button
                                                    variant="contained"
                                                    className={`px-3 py-1 rounded-md ml-4 ${
                                                    client.status === "Active" ? "!bg-red-500" : "!bg-green-500"
                                                    } text-white`}
                                                    onClick={() => handleStatus(client.uid, client.status)}
                                                    >
                                                    {client.status === "Active" ? "Inactive" : "Active"}
                                                    </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                        <td colSpan="9" className=" text-center font-bold text-red-500 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">No Clients Available</td>
                                    </tr>
                                    )}
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
                className="absolute top-4 right-4 w-8 h-8 bg-red-500 text-gray-700 dark:text-black bg-gray-200 rounded-full"
            >
                X
            </button>
            <h2 className="text-xl font-bold mb-4">Recent Data</h2>

            {/* Card View for Mobile */}
            <div className="max-h-96 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:hidden gap-4">
                {(clientRecentData && clientRecentData.length > 0) ? (
                    clientRecentData.map((data, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md p-4">
                            
                            <p className="text-sm"><strong>Today's Weight:</strong> {data.todayWeight}</p>
                            <p className="text-sm"><strong>Steps:</strong> {data.steps}</p>
                            <p className="text-sm"><strong>Water (L):</strong> {data.water}</p>
                            <p className="text-sm"><strong>Calories Burned:</strong> {data.caloriesburned}</p>
                            <p className="text-sm"><strong>Calories Needed:</strong> {data.caloriesneeded}</p>
                            <p className="text-sm">Timestamp: {formatDate(data.timestamp)}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center font-bold text-red-500 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">No Data Available</p>
                )}
            </div>

            {/* Table View for Desktop */}
            <div className="hidden md:block max-h-96 overflow-y-auto">
                <table className="table-auto w-full border-separate border-spacing-0 shadow-lg rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 text-black dark:bg-gray-700 dark:text-white bg-gray-100 text-gray-600">
                        <tr>
                        <th className="p-4 text-center">Steps</th>
                        <th className="p-4 text-center">Water (L)</th>
                            <th className="p-4 text-center">Today Weight</th>
                            <th className="p-4 text-center">Calories Burned</th>
                            <th className="p-4 text-center">Calories Needed</th> 
                            <th className="p-4 text-center">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientRecentData.map((data, index) => (
                            <tr key={index} className="dark:bg-gray-800 rounded-lg md:rounded-sm divide-gray-400 shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200">
                                <td className="p-4 text-center">{data.steps}</td>
                                <td className="p-4 text-center">{data.water}</td>
                                <td className="p-4 text-center">{data.todayWeight}</td>
                                <td className="p-4 text-center">{data.caloriesburned}</td>
                                <td className="p-4 text-center">{data.caloriesneeded}</td>
                                <td className="p-4 text-center">{formatDate(data.timestamp)}</td>
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