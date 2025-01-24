import { useState , useCallback, useEffect} from "react"
import { doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
const Getagencies = ({data })=>{
const [agencies , setAllAgencies] = useState("")
const [error, setError] = useState(null);
        useEffect(() => {
                const fetchUserData = async () => {
                    try {
                        // Query Firestore to fetch users where usertype = 'agencies'
                        const q = query(collection(db, "users"), where("userType", "==", "agency"));
                        const querySnapshot = await getDocs(q);
                        console.log(querySnapshot)
                        if (!querySnapshot.empty) {
                          const usersData = querySnapshot.docs.map(doc => doc.data());
                          setAllAgencies(usersData); // Set agencies data
                          console.log(usersData)
                        } else {
                          setError('No agencies found.');
                        }
                      } catch (err) {
                        setError('Failed to fetch user data.');
                        console.error(err);
                      }
                    };
                    fetchUserData();
        }, []);
useEffect(()=>{

},[agencies])

return (
    <div className="p-4">
        <h1 className="text-xl font-bold">Top Gym's</h1>
      {error && <p>{error}</p>}
      <div>
        {agencies && agencies.length > 0 ? (
          agencies.map((agency, index) => (
            <div key={index} className="overflow-x-auto mb-6">
            {/* Row 1: Headers */}
            <div className="flex justify-between p-2 font-bold">
              <div className="w-1/6">Name</div>
              <div className="w-1/6">Owner Name</div>
              <div className="w-1/6">Phone Number</div>
              <div className="w-1/6">Price</div>
              <div className="w-1/6">Rate</div>
            </div>
            {/* Row 2: Values */}
            <div className="flex justify-between p-2">
              <div className="w-1/6">{agency.agencyName}</div>
              <div className="w-1/6">{agency.ownerName}</div>
              <div className="w-1/6">{agency.phonenumber}</div>
              <div className="w-1/6">{agency.price}</div>
              <div className="w-1/6">{agency.rate}</div>
            </div>
          </div>
          ))
        ) : (
          <p>No agencies to display.</p>
        )}
      </div>
    </div>
)

}
export default Getagencies