import React, { useState, useEffect } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, getDoc, doc, updateDoc, deleteDoc, setDoc, onSnapshot } from 'firebase/firestore';
import Button from '@mui/material/Button';
const Requestdata = (agencydata) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  // Fetch data automatically on component mount using onSnapshot for real-time updates
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Marketrequests"), async (marketRequestsSnapshot) => {
      setLoading(true);
      try {
        const combinedData = [];
        for (const requestDoc of marketRequestsSnapshot.docs) {
          const request = { id: requestDoc.id, ...requestDoc.data() };
          const userDoc = await getDoc(doc(db, "users", request.userId));
          if (!userDoc.exists()) {
            continue;
          }
          const user = userDoc.data();
          const marketDoc = await getDoc(doc(db, "Market", request.productId));
          if (!marketDoc.exists()) {
            continue;
          }
          const market = marketDoc.data();
          combinedData.push({ ...request, user, market });
        }
        setData(combinedData);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    });
    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []); // Empty dependency array to run only once on mount

  const handleStatusUpdate = async (item, status) => {
    setUpdatingStatus(true);
    try {
      if (status === 'confirmed') {
        // Remove the request from Marketrequests
        const marketRequestDoc = doc(db, "Marketrequests", item.id);
        await deleteDoc(marketRequestDoc);
        // Add the request to the Transactions collection
        const transactionRef = doc(collection(db, "Transactions"), item.id); // Use item.id for unique transaction ID
        await setDoc(transactionRef, {
          productId: item.productId,
          userId: item.userId,
          agencyname : agencydata.agencydata.agencyName,
          quantity: item.quantity,
          status: 'confirmed',
          price: item.market.price,
          createdAt: new Date(),
          user: item.user,
          market: item.market,
         });
        // Reduce the quantity in the Market collection if the status is confirmed
        const marketDoc = doc(db, "Market", item.productId);
        const marketSnapshot = await getDoc(marketDoc);
        if (marketSnapshot.exists()) {
          const currentQuantity = marketSnapshot.data().quantity;
          const newQuantity = currentQuantity - item.quantity; // Subtract the requested quantity
          // Ensure the quantity doesn't go below 0
          if (newQuantity >= 0) {
            await updateDoc(marketDoc, { quantity: newQuantity });
          } else {}
        } else {}
      } else if (status === 'declined') {
        // Remove the request from Marketrequests
        const marketRequestDoc = doc(db, "Marketrequests", item.id);
        await deleteDoc(marketRequestDoc);
        // Add the request to the Declinedrequests collection
        const declinedRequestRef = doc(collection(db, "Declinedrequests"), item.id); // Use item.id for unique declined request ID
        await setDoc(declinedRequestRef, {
          productId: item.productId,
          userId: item.userId,
          agencyname : agencydata.agencydata.agencyName,
          quantity: item.quantity,
          status: 'declined',
          price: item.market.price,
          createdAt: new Date(),
          user: item.user,
          market: item.market,
        });
      }

    } catch (error) {

    } finally {
      setUpdatingStatus(false);
    }
  };

  const toggleOverlay = () => {
    setOverlayVisible(!overlayVisible);
  };

  return (
    <div className='mt-2 md:mt-0'>
    {/* Show overlay when requested */}
    <Button
    variant='contained'
      onClick={toggleOverlay}
      className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition duration-300 dark:bg-blue-500 dark:hover:bg-blue-900"
    >
      View Requests
    </Button>
  
    {/* Overlay with all the requests */}
    {overlayVisible && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center dark:bg-opacity-70">
        <div className="bg-white p-6 rounded-lg w-11/12 sm:w-96 shadow-lg relative mt-16 max-h-[80vh] overflow-auto dark:bg-gray-800 dark:text-white">
          <button
            onClick={toggleOverlay}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full  w-8 h-8 hover:bg-red-600 transition duration-300 dark:bg-red-600 dark:hover:bg-red-700"
          >
            ×
          </button>
  
          <h3 className="text-2xl font-bold mb-4 dark:text-white">Market Requests</h3>
  
          {/* Display all market requests in one div */}
          { data.length > 0 ? (
            <div>
              {/* Loop through data and display all requests in one div */}
              {data.map((item, index) => (
                <div key={index} className="mb-4 p-4 border-b border-gray-300 dark:border-gray-600">
                  <p><strong className="dark:text-gray-300">Product Name:</strong> <span className="dark:text-gray-300">{item.market?.name || 'N/A'}</span></p>
                  <p><strong className="dark:text-gray-300">User Name:</strong> <span className="dark:text-gray-300">{item.user?.fullName || 'N/A'}</span></p>
                  <p><strong className="dark:text-gray-300">Requested Quantity:</strong> <span className="dark:text-gray-300">{item.quantity || '0'}</span></p>
  
                  {/* Buttons to confirm or reject each request */}
                  <div className="mt-4 flex justify-start space-x-4">
                    <Button
                      variant='contained'
                      color="success"
                      onClick={() => handleStatusUpdate(item, 'confirmed')}
                      disabled={updatingStatus}
                      className="bg-green-500 !text-white py-2 px-6 rounded-lg hover:bg-green-800 transition duration-300 disabled:opacity-50 dark:bg-green-600 dark:hover:bg-green-700"
                    >
                      {updatingStatus ? 'Updating...' : 'Confirm'}
                    </Button>
                    <Button
                      variant='contained'
                      onClick={() => handleStatusUpdate(item, 'declined')}
                      disabled={updatingStatus}
                      className="!bg-red-500 !text-white py-2 px-6 rounded-lg ! hover:bg-red-600 transition duration-300 disabled:opacity-50 dark:bg-red-600 dark:hover:bg-red-700"
                    >
                      {updatingStatus ? 'Updating...' : 'Decline'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-center font-bold text-red-500 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg'>No Requests Available.</p>
          )}
        </div>
      </div>
    )}
  </div>
  );
};

export default Requestdata;
