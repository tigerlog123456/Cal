import React, { useState, useEffect } from "react";
import { getFirestore, collection, addDoc, getDocs, updateDoc, doc, onSnapshot } from "firebase/firestore";
import moment from "moment";
import Requestdata from "./getrequested";

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
    } catch (error) {
    }
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
    <div className={`p-4 mt-10 max-w-4xl mx-auto`}>
        
      {/* Form Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8 dark:bg-gray-800 dark:text-white">
        <div className="flex flex-col md:flex-row align-center items-center justify-between">  <>
       
        <h2 className="text-xl font-bold ">{editingIndex !== null ? "Edit Market Data" : "Add Market Data"}</h2>
        <Requestdata data={data} /> </>
        </div>
      
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            {editingIndex !== null ? "Update" : "Submit"}
          </button>
        </form>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketData.map((item, index) => (
          <div
            key={index}
            className="bg-white shadow-lg rounded-lg overflow-hidden dark:bg-gray-800 dark:text-white"
          >
            {item.picture && (
              <img
                src={item.picture}
                alt={item.name}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-lg font-bold mb-2 text-center">{item.name}</h3>
              <p className="text-sm mb-2 text-gray-700 dark:text-gray-300 text-center" >
                {item.description}
              </p>
              <p className="text-sm mb-2 text-center">Price: ${item.price}</p>
              <p className="text-sm mb-2 text-center">
                Quantity: {item.quantity === 0 ? "Sold Out" : item.quantity}
              </p>
              <p className="text-sm mb-4 text-center">Status: {item.status}</p>
              <button
                onClick={() => handleEdit(index)}
                className="w-full  bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Market;
