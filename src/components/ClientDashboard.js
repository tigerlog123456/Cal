import React , {usestate , useCallback} from "react";

import '../App.css'
import Addrecentdata from "../functions/addrecentdata";
import Getrecentdata from "../functions/getrecentdata";
const ClientDashboard = ({data}) => {
    return (
        <div className="">
        
        {(data.status == "deactivated") ? (
        <div>Account is Banned Please Contact the support team</div>
        ) : (
        <>
        <h2>Welcome, {data.fullName}</h2>
        <Addrecentdata data={data} />
        <Getrecentdata data={data} />
        </>
        )}
         
          {/* You can add more data display here */}
        </div>
      );
}

export default ClientDashboard;