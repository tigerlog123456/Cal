import React, { useState, useEffect } from "react";
import { getFirestore, collection, onSnapshot, query, where, addDoc, getDocs } from "firebase/firestore";

const Marketdata = ({ data }) => {
  const [marketData, setMarketData] = useState([]);
  const [quantity, setQuantity] = useState("");
  const db = getFirestore();

  // Fetch market data where agencyCode matches data.agencyId and status is active
  const fetchMarketData = () => {
    try {
      const q = query(
        collection(db, "Market"),
        where("agencyCode", "==", data.agencyId),
        where("status", "==", "active") // Only get active products
      );

      // Use onSnapshot for real-time updates
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMarketData(fetchedData);
      });

      // Clean up the listener when the component unmounts
      return unsubscribe;
    } catch (error) {
      console.error("Error fetching market data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = fetchMarketData();
    return () => unsubscribe();
  }, [data.agencyId]); // Re-run when agencyId changes

  // Handle request product action
  const handleRequestProduct = async (productId, availableQuantity) => {
    if (!data?.uid) return;
    if (!quantity || quantity <= 0) return;
    if (quantity > availableQuantity) return;

    try {
      await addDoc(collection(db, "Marketrequests"), {
        userId: data.uid,
        agencyCode: data.agencyId,
        productId: productId,
        quantity: Number(quantity),
        status: "Pending",
        requestTime: new Date().toISOString(),
      });

      setQuantity(""); // Reset quantity input
    } catch (error) {
      console.error("Error requesting product:", error);
    }
  };

  return (
    <div className="p-6 mt-8 max-w-5xl mx-auto">
    <h1 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-6">Market Products</h1>
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {marketData.map((item) => (
        <div
          key={item.id}
          className="bg-white shadow-lg rounded-lg overflow-hidden dark:bg-gray-800 dark:text-white transition-transform hover:scale-105 hover:shadow-xl transform"
        >
          {item.picture && (
            <img
              src={item.picture}
              alt={item.name}
              className="w-full h-40 object-cover transition-transform duration-300 transform group-hover:scale-110"
            />
          )}
          <div className="p-4">
            {/* Product Name */}
            <h3 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-2 transition-colors hover:text-blue-600 dark:hover:text-blue-400">
              {item.name}
            </h3>
            
            {/* Product Description */}
            <p className="text-sm text-gray-600 text-center dark:text-gray-300 mb-3 line-clamp-2">
              {item.description}
            </p>
  
            {/* Price Section */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">Price:</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">${item.price}</p>
            </div>
  
            {/* Quantity Section */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">Quantity:</p>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                  disabled={quantity <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded-full border bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-white hover:bg-gray-300 disabled:cursor-not-allowed transition duration-150"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={item.quantity}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Qty"
                  className="w-16 text-center py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                  onClick={() => setQuantity((prev) => Math.min(prev + 1, item.quantity))}
                  disabled={quantity >= item.quantity}
                  className="w-8 h-8 flex items-center justify-center rounded-full border bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-white hover:bg-gray-300 disabled:cursor-not-allowed transition duration-150"
                >
                  +
                </button>
              </div>
            </div>
  
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
              {item.quantity > 0 ? `${item.quantity} available` : "Sold Out"}
            </p>
  
            <button
              onClick={() => handleRequestProduct(item.id, item.quantity)}
              disabled={item.quantity <= 0}
              className={`w-full px-4 py-2 text-white font-medium rounded-md shadow-sm transition-all ${
                item.quantity > 0
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {item.quantity > 0 ? "Request Product" : "Out of Stock"}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
  
  
  
  );
};

export default Marketdata;
