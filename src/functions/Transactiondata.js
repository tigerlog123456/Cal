import { useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { jsPDF } from "jspdf";
import Requestdata from "./getrequested";
const Transactiondata = ({ data }) => {
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    useEffect(() => {
        if (!data) return;
        const q = query(
            collection(db, "Transactions"),
            where("market.agencyId", "==", data.uid)
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const transactionsList = querySnapshot.docs.map(doc => {
                const transaction = doc.data();
                return {
                    id: doc.id,
                    userFullname: transaction.user?.fullName || "N/A",
                    marketName: transaction.market?.name || "N/A",
                    marketPrice: transaction.market?.price || 0,
                    quantity: transaction.quantity || 0,
                    createdAt: transaction.createdAt?.toDate ? transaction.createdAt.toDate() : null,
                };
            });
            transactionsList.sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
            setTransactions(transactionsList);
        });
        return () => unsubscribe();
    }, [data]);

    const formatDate = (date) => {
        if (!date) return "N/A";
        return new Intl.DateTimeFormat("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(date);
    };

    const formatToDateString = (date) => {
        if (!date) return "";
        return date.toISOString().split('T')[0]; // Convert to "yyyy-mm-dd"
    };

    const generateTransactionPDF = (transaction) => {
        const doc = new jsPDF();
        // Set document styles
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("Receipt", 105, 20, null, null, "center");

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");

        let yOffset = 30;

        // Draw border
        doc.setLineWidth(0.5);
        doc.rect(10, 10, 190, 140); // Adjust height dynamically

        // Table Header
        doc.setFont("helvetica", "bold");
        doc.setFillColor(200, 200, 200); // Light gray background
        doc.rect(14, yOffset, 182, 8, "F"); // Header row
        doc.text("Receipt Details", 105, yOffset + 5, null, null, "center");

        yOffset += 20;

        // Table Content
        doc.setFont("helvetica", "normal");

        const tableData = [
            ["Receipt ID", transaction.id],
            ["Full Name", transaction.userFullname],
            ["Product Name", transaction.marketName],
            ["Price per Unit", `$${transaction.marketPrice}`],
            ["Quantity", `${transaction.quantity}`],
            ["Total Amount", `$${transaction.quantity * transaction.marketPrice}`],
            ["Purchased Date", formatDate(transaction.createdAt)]
        ];

        tableData.forEach(([label, value]) => {
            doc.text(`${label}:`, 20, yOffset);
            doc.text(`${value}`, 100, yOffset);
            yOffset += 10;
        });

        yOffset += 10;

        // Footer
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.text("Thank you for your business!", 105, yOffset, null, null, "center");

        // Save the PDF
        doc.save(`${transaction.id}_transaction_receipt.pdf`);
    };

    // Filter transactions based on search and selectedDate
    const filteredTransactions = transactions.filter((transaction) => {
        const matchesSearch = 
            transaction.id.toLowerCase().includes(search.toLowerCase()) ||
            transaction.userFullname.toLowerCase().includes(search.toLowerCase());

        // If selectedDate is provided, check if the transaction's date matches
        const matchesDate = selectedDate
            ? formatToDateString(transaction.createdAt) === selectedDate
            : true;

        return matchesSearch && matchesDate;
    });

    return (
        <div className="p-6 dark:bg-gray-900 dark:text-white">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">Transactions</h2>
            
            {/* Search & Date Inputs */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
                <input
                    type="text"
                    placeholder="Search by ID or Full Name"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full sm:w-1/2 bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg w-full sm:w-1/3 bg-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500"
                />
                <Requestdata agencydata={data} />
            </div>

            {/* Mobile View - Cards */}
            <div className="grid grid-cols-1 md:hidden gap-4 max-h-[500px] overflow-y-auto scrollbar-hide">
        {filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="bg-white p-5 border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{transaction.userFullname}</h3>
                <p className="text-gray-600 dark:text-gray-300"><strong>Market:</strong> {transaction.marketName}</p>
                <p className="text-gray-600 dark:text-gray-300"><strong>Price:</strong> ${transaction.marketPrice}</p>
                <p className="text-gray-600 dark:text-gray-300"><strong>Quantity:</strong> {transaction.quantity}</p>
                <p className="text-gray-800 font-semibold dark:text-white"><strong>Total:</strong> ${transaction.marketPrice * transaction.quantity}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm"><strong>Confirmed At: </strong> {formatDate(transaction.createdAt)}</p>
                <button
                    onClick={() => generateTransactionPDF(transaction)}
                    className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
                >
                    Download PDF
                </button>
            </div>
        ))}
    </div>

            {/* Desktop View - Table */}
            <div className="hidden md:block overflow-x-auto max-h-[500px] overflow-y-auto scrollbar-hide">
                <table className="min-w-full rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                        <tr className="text-gray-800 dark:text-white">
                            <th className="p-3 text-center">ID</th>
                            <th className="p-3 text-center">Full Name</th>
                            <th className="p-3 text-center">Market Name</th>
                            <th className="p-3 text-center">Price</th>
                            <th className="p-3 text-center">Quantity</th>
                            <th className="p-3 text-center">Total</th>
                            <th className="p-3 text-center">Confirmed At</th>
                            <th className="p-3 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 ">
                        {filteredTransactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-all max-h-96 overflow-y-auto">
                                <td className="p-3 text-center">{transaction.id}</td>
                                <td className="p-3 text-center">{transaction.userFullname}</td>
                                <td className="p-3 text-center">{transaction.marketName}</td>
                                <td className="p-3 text-center">${transaction.marketPrice}</td>
                                <td className="p-3 text-center">{transaction.quantity}</td>
                                <td className="p-3 text-center font-semibold">${transaction.marketPrice * transaction.quantity}</td>
                                <td className="p-3  text-center text-gray-500 dark:text-gray-400 text-sm">{formatDate(transaction.createdAt)}</td>
                                <td className="p-3 text-center">
                                    <button
                                        onClick={() => generateTransactionPDF(transaction)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
                                    >
                                        Download PDF
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Transactiondata;
