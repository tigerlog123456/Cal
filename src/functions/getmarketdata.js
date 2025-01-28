import React, { useState, useEffect } from "react";
import { getFirestore, collection, onSnapshot, query, where , addDoc , getDocs } from "firebase/firestore";

const Marketdata = ({ data, user }) => {
  const [marketData, setMarketData] = useState([]);
  const [quantity, setQuantity] = useState("");
  const db = getFirestore();

  // Fetch market data where agencyCode matches data.agencyId
  const fetchMarketData = () => {
    try {
      const q = query(collection(db, "Market"), where("agencyCode", "==", data.agencyId));
      
      // Use onSnapshot for real-time updates
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMarketData(fetchedData);
      });

      // Return the unsubscribe function to clean up when the component unmounts
      return unsubscribe;
    } catch (error) {
     
    }
  };

  useEffect(() => {
    const unsubscribe = fetchMarketData();
    
    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [data.agencyId]); // Re-run when the agencyId changes

  // Check if the user has an active request for the product
  const hasActiveRequest = async (productId) => {
    try {
      const q = query(
        collection(db, "Marketrequests"),
        where("userId", "==", data.uid),
        where("productId", "==", productId),
        where("status", "!=", "Done")
      );
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
     
      return false;
    }
  };

  // Handle request product action
  const handleRequestProduct = async (productId, availableQuantity) => {
    if (!data?.uid) {
   
      return;
    }
  
    if (!quantity || quantity <= 0) {

      return;
    }
  
    // Check if the requested quantity exceeds available stock
    if (quantity > availableQuantity) {
  
      return;
    }
  
    const isActive = await hasActiveRequest(productId);
    if (isActive) {
    
      return;
    }
  
    try {
      await addDoc(collection(db, "Marketrequests"), {
        userId: data.uid,
        agencyCode: data.agencyId,
        productId: productId,
        quantity: Number(quantity),
        status: "Pending", // Default status
        requestTime: new Date().toISOString(),
      });
    
      setQuantity(""); // Reset quantity input
    } catch (error) {
    
    }
  };
  
  return (
    <div className="p-6 mt-10 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Market Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketData.map((item) => (
          <div
            key={item.id}
            className="bg-white shadow-md rounded-lg overflow-hidden dark:bg-gray-800 dark:text-white"
          >
            {item.picture && (
              <img
                src={item.picture}
                alt={item.name}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2">{item.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {item.description}
              </p>
              <p className="text-sm font-semibold mb-2">Price: ${item.price}</p>
              <p className="text-sm mb-4">
                Quantity: {item.quantity > 0 ? item.quantity : "Sold Out"}
              </p>
              <input
                type="number"
                min="1"
                max={item.quantity} // Set max to the available quantity
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                className="w-full mb-3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <button
                onClick={() => handleRequestProduct(item.id, item.quantity)} // Pass available quantity to the handler
                disabled={item.quantity <= 0}
                className={`w-full px-4 py-2 text-white rounded-lg shadow-md ${
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
