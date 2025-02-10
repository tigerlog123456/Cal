import React from "react";
import '../App.css'; // Keep your CSS file if needed for global styles
import Navbar from "../components/Navbar";
import Button from '@mui/material/Button';
const Notfound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100">
            <Navbar />
            <div className="text-center mt-10">
                <h1 className="text-6xl font-bold mb-4 text-red-500">404</h1>
                <p className="text-xl mb-8 text-red-500 font-bold">Oops! The Page You’re Looking For Doesn’t Exist.</p>
                <Button
                    variant="contained"
                    onClick={() => window.location.href = '/Cal'}
                    className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition duration-200"
                >
                    Back to Home
                </Button>
            </div>
        </div>
    );
};

export default Notfound;
