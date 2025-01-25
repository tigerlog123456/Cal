  import React , {useState , useCallback, useEffect} from "react";

  import '../App.css'
  import Addrecentdata from "../functions/addrecentdata";
  import Getrecentdata from "../functions/getrecentdata";
  import Getagencies from "../functions/getallagencies";
  import Totaldatas from "../functions/Totaldatas";
  const ClientDashboard = ({data}) => {
    const [refreshKey, setRefreshKey] = useState(0);
    const [refreshKay1 , setRefreshKey1] = useState(0)
    const [recent , setrecent] = useState("")
    const handleDataAdded = () => {
        setRefreshKey((prevKey) => prevKey + 1);
        setRefreshKey1((prevKey) => prevKey + 1);
      }
      return (
          <div className="">
          {(data.status == "deactivated") ? (
          <div>Account is Banned Please Contact the support team</div>
          ) : (
          <>
          <h2>Welcome, {data.fullName}</h2>
          <Totaldatas data ={data} recentdata={recent}  key={`total-${refreshKay1}`}/>
          <Addrecentdata data={data} onDataAdded={handleDataAdded}/>
          <Getrecentdata data={data} key={`recent-${refreshKey}`} Setrecent={setrecent} />
          {data && data.agencyId == "" && (
            <Getagencies data={data}   />
          )}
          </>
          )}  
            {/* You can add more data display here */}
          </div>
        );
  }

  export default ClientDashboard;