import { useState, useEffect } from "react";

import '../App.css';

const Registerinfo = ({ setusertype, registerdata }) => {
    const [Fullname, setFullname] = useState("");
    const [age, setAge] = useState("");
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [targetweight, setTargetweight] = useState("");
    const [health, setHealth] = useState("");
    const [agencyname, setAgencyname] = useState("");
    const [ownername, setOwnername] = useState("");
    const [location, setLocation] = useState("");
    const [phonenumber, setPhonenumber] = useState("");
    const [price, setPrice] = useState(0);
    const status = "active";
    const rate = 0;

    useEffect(() => {
        registerdata({
            Fullname,
            age,
            weight,
            height,
            targetweight,
            health,
            agencyname,
            ownername,
            status,
            location,
            phonenumber,
            rate,
            price,
        });
    }, [Fullname, age, weight, height, targetweight, health, agencyname, ownername, status, location, phonenumber, rate, price]);

    const renderusertype = () => {
        const usertype = setusertype;
        switch (usertype) {
            case "client":
                return (
                    <div className="flex flex-col flex-wrap md:h-48 h-auto gap-4 justify-center">
                        <div className="flex items-center w-full">
                            <input
                                type="text"
                                maxLength={25}
                                placeholder="Full Name"
                                value={Fullname}
                                onChange={(e) => setFullname(e.target.value)}
                                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            />
                        </div>
                        <div className="flex items-center w-full">
                            <input
                                type="number"
                                placeholder="Age"
                                value={age}
                                min={16}
                                onChange={(e) => setAge(e.target.value)}
                                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            />
                        </div>
                        <div className="flex items-center w-full">
                            <input
                                type="number"
                                min={20}
                                value={weight}
                                placeholder="Weight"
                                onChange={(e) => setWeight(e.target.value)}
                                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                                
                            />
                        </div>
                        <div className="flex items-center w-full">                 
                            <input
                                type="number"
                                min={20}
                                placeholder="Height"
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            />
                        </div>
                        <div className="flex items-center w-full">
                            <input
                                type="number"
                                min={20}
                                value={targetweight}
                                placeholder="Target Weight"
                                onChange={(e) => setTargetweight(e.target.value)}
                                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            />
                        </div>
                        <div className="flex items-center w-full">
                            <input
                                type="text"
                                maxLength={50}
                                value={health}
                                placeholder="Health Condition"
                                onChange={(e) => setHealth(e.target.value)}
                                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            />
                        </div>
                    </div>
                );
            case "agency":
                return (
                    <div className="flex flex-col flex-wrap md:h-52 h-auto gap-4 justify-center">
                        <div className="flex items-center w-full">
                            <input
                                type="text"
                                maxLength={20}
                                value={agencyname}
                                placeholder="Agency Name"
                                onChange={(e) => setAgencyname(e.target.value)}
                                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            />
                        </div>
                        <div className="flex items-center w-full">                      
                            <input
                                type="text"
                                maxLength={25}
                                value={ownername}
                                placeholder="Owner Name"
                                onChange={(e) => setOwnername(e.target.value)}
                                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            />
                        </div>
                        <div className="flex items-center w-full">                      
                            <input
                                type="text"
                                minLength={8}
                                maxLength={12}
                                value={phonenumber}
                                placeholder="Phone Number"
                                onChange={(e) => setPhonenumber(e.target.value)}
                                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            />
                        </div>
                        <div className="flex items-center w-full">                        
                            <input
                                type="text"
                                maxLength={40}
                                value={location}
                                placeholder="Location"
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            />
                        </div>
                        <div className="flex items-center w-full">
                            <input
                                type="number"
                                min={1}
                                placeholder="Price"
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                required
                            />
                        </div>
                    </div>
                );
            default:
                return <p>Invalid user type. Please contact support.</p>;
        }
    };
    return (
        <div>
            {renderusertype()}
        </div>
    );
};

export default Registerinfo;
