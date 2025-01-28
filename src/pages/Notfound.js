import React from "react";
import '../App.css'; // Keep your CSS file if needed for global styles
import Navbar from "../components/Navbar";

const Notfound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            <Navbar />
            <div className="text-center mt-10">
                <h1 className="text-6xl font-bold mb-4">404</h1>
                <p className="text-xl mb-8">Oops! The page you’re looking for doesn’t exist.</p>
                <button
                    onClick={() => window.location.href = '/Cal'}
                    className="px-6 py-3 bg-indigo-600 text-white text-lg rounded-lg hover:bg-indigo-700 transition duration-200"
                >
                    Back to Home
                </button>
            </div>
        </div>
    );
};

export default Notfound;
