import React, { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, updateDoc, doc, onSnapshot } from "firebase/firestore";
import moment from "moment";
import Button from '@mui/material/Button';
const Market = ({ data }) => {
  const [formData, setFormData] = useState({
    picture: "", // Store the URL of the image
    name: "",
    description: "",
    price: "",
    quantity: "",
    status: "active", // Default status
  });
  const [marketData, setMarketData] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const db = getFirestore();
  // Handle input changes for text fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.picture || !formData.name || !formData.description || !formData.price || !formData.quantity) {
      alert("All fields are required. Please fill them out.");
      return;
    }
    try {
      if (editingIndex !== null) {
        // Update existing document
        const docRef = doc(db, "Market", marketData[editingIndex].id);
        await updateDoc(docRef, {
          ...formData,
          time: moment().format("dddd/MM/YYYY HH:mm"),
        });
      } else {
        // Add new document
        await addDoc(collection(db, "Market"), {
          ...formData,
          agencyId: data.uid,
          agencyCode: data.agencyCode,
          time: moment().format("dddd/MM/YYYY HH:mm"),
        });
      }
      // Clear the form and refresh data
      setFormData({
        picture: "",
        name: "",
        description: "",
        price: "",
        quantity: "",
        status: "active",
      });
      setEditingIndex(null);
    } catch (error) {}
  };
  // Fetch market data from Firestore and set up real-time updates
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "Market"), (querySnapshot) => {
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMarketData(data);
    });
    // Clean up the listener when the component is unmounted
    return () => unsubscribe();
  }, [db]);
  // Handle edit button click
  const handleEdit = (index) => {
    setEditingIndex(index);
    setFormData({
      picture: marketData[index].picture,
      name: marketData[index].name,
      description: marketData[index].description,
      price: marketData[index].price,
      quantity: marketData[index].quantity,
      status: marketData[index].status,
    });
  };
  return (
    <div className={`p-4  max-w-4xl mx-auto`}>
      {/* Form Section */}
      <div className="bg-white shadow-md mt-10 md:mt-14 rounded-lg p-6 mb-2 dark:bg-gray-800 dark:text-white">
        <div className="flex flex-col md:flex-row align-center items-center justify-between">  <> 
        <h2 className="text-xl font-bold ">{editingIndex !== null ? "Edit Market Data" : "Add Market Data"}</h2>
         </>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="block text-sm font-medium mb-2">Picture URL</label>
            <input
              type="text"
              name="picture"
              value={formData.picture}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter image URL"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter product name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter product description"
              rows="4"
              required
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter price"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter quantity"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className={(formData.status == "active") ? "w-full px-4 py-2 text-green-500 font-bold border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-green-500" : "w-full px-4 py-2 text-red-500 font-bold border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-red-500"}
            >
              <option className="text-green-500 font-bold" value="active">Active</option>
              <option className="text-red-500 font-bold" value="inactive">Inactive</option>
            </select>
          </div>
          <Button
            variant="contained"
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {editingIndex !== null ? "Update" : "Submit"}
          </Button>
        </form>
      </div>
      {/* Cards Section */}
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold text-center text-gray-900 dark:text-white mb-6">
          Market Products
        </h1>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {marketData.map((item, index) => (
      <div
        key={index}
        className="bg-white shadow-lg rounded-lg overflow-hidden dark:bg-gray-800 dark:text-white transition-transform hover:scale-105 hover:shadow-xl transform"
      >
        {/* Product Image */}
        {item.picture && (
          <img
            src={item.picture}
            alt={item.name}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        )}
        <div className="p-4">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-center">
            {item.name}
          </h3>
          {/* Product Description */}
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 text-center line-clamp-2">
            {item.description}
          </p>
          {/* Price */}
          <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold text-gray-800 dark:text-gray-100">Price:</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">${item.price}</p>
              </div>
          {/* Quantity and Status */}
          <div className="flex flex-col items-center mb-3">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
                {item.quantity > 0 ? (<span className="text-green-500 font-bold">{item.quantity} AVAILABLE</span>) : (<span className="text-red-500 font-bold">SOLD OUT</span>)}
              </p>
            <p className="text-center text-gray-600 dark:text-gray-400">
              Status: {(item.status == "active") ? (<span className="text-green-500 font-bold"> Active</span> ):(<span className="text-red-500 font-bold"> Inactive</span>)}
            </p>
          </div>
          {/* Edit Button */}
          <Button
            variant="contained"
            onClick={() => handleEdit(index)}
            className="w-full py-2 px-4 !bg-green-600 text-white font-semibold rounded-md shadow-sm !hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 transition-all"
          >
            Edit
          </Button>
        </div>
      </div>
    ))}
  </div>
</div>
</div>
  );
};

export default Market;
