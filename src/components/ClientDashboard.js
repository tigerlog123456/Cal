import React, { useState } from "react";
import "../App.css";
import Addrecentdata from "../functions/addrecentdata";
import Getrecentdata from "../functions/getrecentdata";
import Getagencies from "../functions/getallagencies";
import Totaldatas from "../functions/Totaldatas";
import Marketdata from "../functions/getmarketdata"
import GetPT from "../functions/getPt";
import ChatModule from "../functions/chatmodule";
const ClientDashboard = ({ data }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshKay1, setRefreshKey1] = useState(0);
  const [recent, setrecent] = useState("");
// Update to refresh the key
  const handleDataAdded = () => {
    setRefreshKey((prevKey) => prevKey + 1);
    setRefreshKey1((prevKey) => prevKey + 1);
  };
  return (
    <div className="bg-gray-50 dark:bg-gray-800 min-h-screen h-full pt-20 dark:text-white">
        <>
          {/* Welcome Section */}
          <div className="text-center mt-6 mb-6">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
              Welcome, {data.fullName}
            </h2>
          </div>

          {/* Total Data Component */}
          <div className="max-w-4xl mx-auto px-4 mb-10">
            <Totaldatas data={data} recentdata={recent} key={`total-${refreshKay1}`}/>
          </div>

          {/* Add Recent Data */}
          <div className="max-w-full mx-auto px-4 mb-10 flex flex-col md:flex-row gap-4 justify-center">

            <Addrecentdata data={data} onDataAdded={handleDataAdded}  />
            <Getrecentdata data={data} key={`recent-${refreshKey}`} Setrecent={setrecent} />
          </div>

          {/* Get Recent Data */}
          <div className="max-w-4xl mx-auto px-4">
            
          </div>
          {data && data.agencyId && (
            <div className="max-w-4xl mx-auto px-4 mt-6">
            <GetPT data={data}/>
           <Marketdata data={data}/>
          </div>
          )}     
          {/* Get Agencies if No Agency Connected */}
          {data && data.agencyId === "" && (
            <div className="max-w-4xl mx-auto px-4 mt-10">
              <Getagencies data={data} />
            </div>
          )}
          {/*chat module*/}
          {data && data.agencyId && (
             <div>
            <ChatModule data={data}/>
          </div>
          )

          }
         
        </>
    </div>
  );
};

export default ClientDashboard;
