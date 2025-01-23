import { useState , useEffect} from "react"
import '../App.css'
const Registerinfo = ({setusertype , registerdata}) =>{
 const [Fullname , setfullname] = useState("")
    const [age , setage] = useState("")
    const [weight , setweight] =  useState("")
    const [ height , setheight] = useState("")
    const [targetweight ,settargetweight] = useState("")
    const [health , sethealth] = useState("")
    const [agencyname , setagencyname] = useState("")
    const [ownername , setownername] = useState("")
    const [location , setlocation] = useState("")
    const [phonenumber , setphonenumber] = useState("")
    const status = 'active'
    const rate = 0
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
        });
    }, [Fullname, age, weight, height, targetweight, health, agencyname, ownername, status , location , phonenumber , rate]);

    const renderusertype = () => {

        // This is the additional register form , it is either client or agency switch
      const usertype = setusertype
        switch (usertype) {
            case "client":
                return (
        
        <div>
            <input
                type="text"
                placeholder="FullName"
                value={Fullname}
                onChange={(e) => setfullname(e.target.value)}
            />
            <input
                type="text"
                placeholder="Age"
                value={age}
                onChange={(e) => setage(e.target.value) }
            />
            <input
                type="text"
                value={weight}
                placeholder="Weight"
                onChange={(e) => setweight(e.target.value)}
            />
            <input
                type="text"
                placeholder="Height"
                value={height}
                onChange={(e) => setheight(e.target.value)}
            />
            <input
                type="text"
                value={targetweight}
                placeholder="Target Weight"
                onChange={(e) => settargetweight(e.target.value)}
            />
            <input
                type="text"
                value={health}
                placeholder="Health Condition"
                onChange={(e) => sethealth(e.target.value)}
            />
        </div>
                );
            case "agency":
                return (
        <div>
            <input
                type="text"
                value={agencyname}
                placeholder="Agency Name"
                onChange={(e) => setagencyname(e.target.value)}
            />
            <input
                type="text"
                value={ownername}
                placeholder="Owner Name"
                onChange={(e) => setownername(e.target.value)}
            />
            <input
                type="text"
                value={phonenumber}
                placeholder="Phone Number"
                onChange={(e) => setphonenumber(e.target.value)}
            />
            <input
                type="text"
                value={location}
                placeholder="location"
                onChange={(e) => setlocation(e.target.value)}
            />
        </div>
                );
            default:
                return <p>Invalid user type. Please contact support.</p>;
        }};
      return(
        <div>
            {renderusertype()}
        </div>
      )}
      
export default Registerinfo