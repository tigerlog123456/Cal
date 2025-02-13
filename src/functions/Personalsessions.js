import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc , query , where , onSnapshot } from 'firebase/firestore';
import { db } from '../firebase-config'; // Adjust the import path as needed
import Button from '@mui/material/Button';
const PT = (data) => {
  const [sessions, setSessions] = useState([]); // State to store fetched sessions
  const [showForm, setShowForm] = useState(false); // State to toggle form visibility
  const [Participants , setParticipants] = useState([]) 
  const [showparticipants , setshowparticipants] = useState(false)
  const [newSession, setNewSession] = useState({
    name: '',
    date: '',
    duration: '',
    price: '',
    capacity: ''
  });

  useEffect(()=>{
    const unsubscribeSessions = onSnapshot(collection(db, "Personalsessions"), (snapshot) => {
      setSessions(snapshot.docs.map(doc => ({ 
        id: doc.id, 
        agencyId: doc.data().agencyId, // Include agencyId
        createdAt: doc.data().createdAt, 
        ...doc.data()
      })));
    });
    unsubscribeSessions()

  },[db])

  // Fetch sessions from Firestore
  useEffect(() => {
    const fetchSessions = async () => {
      const querySnapshot = await getDocs(collection(db, 'Personalsessions'));
      const sessionsList = querySnapshot.docs.map(doc => ({
        id: doc.id, // Document ID
        agencyId: doc.data().agencyId, // Include agencyId
        createdAt: doc.data().createdAt, // Include createdAt
        ...doc.data() // Spread the document data
      }));
      setSessions(sessionsList);
    };

    fetchSessions();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSession({ ...newSession, [name]: value });
  };
  // Submit new session to Firestore
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Add createdAt and agencyId to the new session data
      const sessionData = {
        ...newSession,
        agencyId: data.data.agencyCode, // Add agencyId from props
        status:"Active",
        createdAt: new Date().toISOString() // Add current timestamp
      };

      // Add the new session to Firestore
      await addDoc(collection(db, 'Personalsessions'), sessionData);

      // Reset the form
      setNewSession({
        name: '',
        date: '',
        duration: '',
        price: '',
        capacity: ''
      });
      setShowForm(false);

      // Refresh the sessions list
      const querySnapshot = await getDocs(collection(db, 'Personalsessions'));
      const sessionsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        agencyId: doc.data().agencyId,
        createdAt: doc.data().createdAt,
        ...doc.data()
      }));
      setSessions(sessionsList);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };
  const fetchParticipants = async(sessionid) =>{
    
     if(sessionid){
     
      try{
        const participantSnapshot = await getDocs(
          query(collection(db, "participatedsession"), where("sessionId", "==", sessionid))
        );          
        const participantlist = participantSnapshot.docs.map(doc => ({
            id: doc.id, // Document ID
            agencyId: doc.data().agencyId, // Include agencyId
            sessions: sessions.find(session => session.id === sessionid) || null,
            ...doc.data() // Spread the document data
          }));
          setParticipants(participantlist)
          setshowparticipants(true)
      }catch(error){}
     } 
  }
  const formatDate = (timestamp) => {
    if (!timestamp) return ""; // Handle undefined timestamps
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).replace(",", "");
  };
  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-6 ">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">Personal Sessions</h1>

      {/* Button to toggle form visibility */}
      <div className="flex justify-center mb-4 sm:mb-6">
        <Button
        variant='contained'
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
        >
          {showForm ? 'Hide Form' : 'Add New Session'}
        </Button>
      </div>

      {/* Form for adding new sessions */}
      {showForm && (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg mb-4 sm:mb-6">
          <div className="space-y-3 sm:space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newSession.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
            <input
              type="datetime-local" // Include date and time
              name="date"
              value={newSession.date}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
            <input
              type="number"
              name="duration"
              placeholder="Duration"
              value={newSession.duration}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={newSession.price}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
            <input
              type="number"
              name="capacity"
              placeholder="Capacity"
              value={newSession.capacity}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              required
            />
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      )}

      {/* Table to display sessions (hidden on mobile) */}
      <div className="overflow-x-auto overflow-y-auto hidden md:block max-h-96">
        <table className="table-auto w-full border-separate border-spacing-0 shadow-lg rounded-lg ">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr className=''>
              <th className="p-2 sm:p-3 text-center">Name</th>
              <th className="p-2 sm:p-3 text-center">Date</th>
              <th className="p-2 sm:p-3 text-center">Duration</th>
              <th className="p-2 sm:p-3 text-center">Price</th>
              <th className="p-2 sm:p-3 text-center">Capacity</th>
              <th className="p-2 sm:p-3 text-center">Participated</th>
              <th className="p-2 sm:p-3 text-center">Status</th>
              <th className="p-2 sm:p-3 text-center">Created At</th>
              <th className="p-2 sm:p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
          {sessions && sessions.length > 0 ? (
            sessions.map(session => (
                <tr key={session.id} className="dark:bg-gray-800 rounded-lg md:rounded-sm divide-gray-400 shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200">
                <td className="p-2 sm:p-3 text-center">{session.name}</td>
                <td className="p-2 sm:p-3 text-center">{formatDate(session.date)}</td>
                <td className="p-2 sm:p-3 text-center">{session.duration}</td>
                <td className="p-2 sm:p-3 text-center">{session.price}</td>
                <td className="p-2 sm:p-3 text-center">{session.capacity}</td>
                <td className="p-2 sm:p-3 text-center">{session.currentParticipants || 0}</td>
                <td className={(session.status === "Active") ? "text-green-500 p-2 sm:p-3 text-center font-bold" : "text-red-500 p-2 sm:p-3 text-center font-bold"}>
                  {session.status}
                </td>
                <td className="p-2 sm:p-3 text-center">{formatDate(session.createdAt)}</td>
                <td className="p-2 sm:p-3 text-center">
                  <Button
                   variant="contained"
                   onClick={()=> fetchParticipants(session.id)}
                  >Participants</Button>
                  </td>
              </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className=" text-center font-bold text-red-500 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">No Sessions Available</td>
              </tr>
                )}
          </tbody>
        </table>
      </div>
      {/* Card view for mobile (hidden on larger screens) */}
      <div className="max-h-96 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:hidden gap-4">
      {sessions && sessions.length > 0 ? (
        sessions.map(session => (
          <div key={session.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="space-y-2">
              <p className="text-lg font-semibold">{session.name}</p>
              <p><span className="font-medium text-center">Date:</span> {formatDate(session.date)}</p>
              <p><span className="font-medium text-center">Duration:</span> {session.duration} {(session.duration > 1) ? "Hours" : "Hour"}</p>
              <p><span className="font-medium text-center">Price:</span> {session.price} $</p>
              <p><span className="font-medium text-center" >Capacity:</span> {session.capacity}</p>
              <p><span className="font-medium text-center" >Participated:</span> {session.currentParticipants || 0}</p>
              <p className={(session.status == "Active")? "text-green-500 font-bold" : "text-red-500 font-bold"}><span className="font-medium text-center" >Status:</span> {session.status}</p>
              <p><span className="font-medium text-center">Created At:</span> {formatDate(session.createdAt)}</p>
              <Button
                   variant="contained"
                   onClick={()=> fetchParticipants(session.id)}>
                    Participants
              </Button>
            </div>
          </div>
        ))
      ):(
        <div className='text-center font-bold text-red-500 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg'>No Sessions Available</div>
      )}
      </div>
      {showparticipants && Participants && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-4xl w-full dark:bg-gray-800">
                        <button
                            onClick={() => setshowparticipants(false)}
                            className="absolute top-4 right-4 w-8 h-8 bg-red-500 text-gray-700 dark:text-black bg-gray-200 rounded-full"
                        >
                            X
                        </button>
                        <div className="overflow-x-auto overflow-y-auto sm:block max-h-96">
                         <table className="table-auto w-full border-separate border-spacing-0 shadow-lg rounded-lg ">
                           <thead className="bg-gray-200 dark:bg-gray-700">
                            <tr className=''>
                               <th className="p-2 sm:p-3 text-center">Name</th>
                               <th className="p-2 sm:p-3 text-center">Email</th>
                               <th className="p-2 sm:p-3 text-center">Price</th>
                            </tr>
                            </thead>
                            <tbody>
                        {Participants && Participants.length > 0 ? (
                          Participants.map(Participant => (
                            <tr key={Participant.id} className="dark:bg-gray-800 rounded-lg md:rounded-sm divide-gray-400 shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200">
                              <td className="p-2 sm:p-3 text-center">{Participant.clientName}</td>
                              <td className="p-2 sm:p-3 text-center">{Participant.email}</td>
                              <td className="p-2 sm:p-3 text-center">{Participant.sessions.price}</td>
                            </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="100%" className=" text-center font-bold text-red-500 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">No Participants Available</td>
                            </tr>
                            )}
                            </tbody>
                          </table>
                        </div>
                    </div>
                </div>
            )}
    </div>
  );
};

export default PT;