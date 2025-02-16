import { useState, useEffect } from "react";
import { db } from "../firebase-config";
import { collection, query, where, onSnapshot, addDoc, getCountFromServer, doc, updateDoc, getDoc, getDocs } from "firebase/firestore";
import Button from '@mui/material/Button';

const GetPT = (data) => {
  const [sessions, setSessions] = useState([]);
  const [userParticipatedSessions, setUserParticipatedSessions] = useState(new Set()); // To track sessions the user participated in

  useEffect(() => {
    // Firestore real-time listener for sessions
    const sessionsQuery = query(
      collection(db, "Personalsessions"),
      where("agencyId", "==", data.data.agencyId)
    );

    const unsubscribe = onSnapshot(sessionsQuery, async (querySnapshot) => {
      const sessionsData = [];
      // Loop through sessions to check how many participants there are
      for (const docSnap of querySnapshot.docs) {
        const session = docSnap.data();
        const sessionId = docSnap.id;
        const participantsQuery = query(
          collection(db, "participatedsession"),
          where("sessionId", "==", sessionId)
        );
        const participantsSnapshot = await getCountFromServer(participantsQuery);
        const numParticipants = participantsSnapshot.data().count;
        // Make sure to initialize currentParticipants if it's undefined
        const currentParticipants = session.currentParticipants || 0;
        // Add session to the list
        sessionsData.push({
          id: sessionId,
          ...session,
          currentParticipants, // Add the current participant count
        });
        // If capacity is reached, update status to "Full"
        if (numParticipants >= session.capacity) {
          const sessionRef = doc(db, "Personalsessions", sessionId);
          await updateDoc(sessionRef, { status: "Full" });
        }
      }
      setSessions(sessionsData);
    });
    // Check for the sessions that the current user has already joined
    const checkJoinedSessions = async () => {
      const participatedQuery = query(
        collection(db, "participatedsession"),
        where("userId", "==", data.data.uid)
      );
      const querySnapshot = await getDocs(participatedQuery);
      const joinedSet = new Set();
      querySnapshot.forEach((doc) => {
        joinedSet.add(doc.data().sessionId);
      });
      setUserParticipatedSessions(joinedSet); // Store the sessionIds where user participated
    };
    checkJoinedSessions();
    // Cleanup function to unsubscribe when component unmounts
    return () => unsubscribe();
  }, [data.data.agencyId, data.data.uid]);
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
  const addToParticipated = async (session) => {
    try {
      // Check the capacity first
      const sessionRef = doc(db, "Personalsessions", session.id);
      const sessionSnapshot = await getDoc(sessionRef);
      const sessionData = sessionSnapshot.data();
      // Ensure currentParticipants is initialized
      const currentParticipants = sessionData.currentParticipants || 0;
      if (currentParticipants >= sessionData.capacity) {
        return;
      }
      await addDoc(collection(db, "participatedsession"), {
        sessionId: session.id,
        userId: data.data.uid,
        clientName: data.data.fullName,
        agencyId: data.data.agencyId,
        email: data.data.email,
        // Add any other user-related information here
      });
      // Update the participated sessions state
      setUserParticipatedSessions(prev => new Set(prev.add(session.id)));
      // Update session's current participant count and check if full
      const newParticipantsCount = currentParticipants + 1;
      await updateDoc(sessionRef, {
        currentParticipants: newParticipantsCount,
      });
      // Check if the new participants count exceeds capacity and update session status if so
      if (newParticipantsCount >= session.capacity) {
        await updateDoc(sessionRef, { status: "Full" }); // Set status to "Full" if capacity is reached
      }
    } catch (error) {}
  };

  return (
    <div className={`p-6 dark:bg-gray-900 dark:text-white bg-white text-gray-900`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-center dark:text-white">
          Personal Sessions
        </h2>
      </div>

      {/* Mobile View - Cards */}
      <div className="grid grid-cols-1 md:hidden gap-4 max-h-[500px] overflow-y-auto">
        {(sessions && sessions.length >0) ?(
          sessions.map((session) => {
            const isJoined = userParticipatedSessions.has(session.id);
            const isFull = session.currentParticipants >= session.capacity;
            return (
              <div
                key={session.id}
                className={`p-5 border rounded-lg flex flex-col md:flex-row gap-2 justify-between  shadow-md dark:bg-gray-800 dark:border-gray-700 bg-gray-100 border-gray-300`}
              >
                <h3 className="text-lg font-semibold dark:text-white">{session.name}</h3>
                <p className="text-gray-400 dark:text-gray-300 font-bold"><strong>Date:</strong> {formatDate(session.date)}</p>
                <p className="text-gray-400 dark:text-gray-300 font-bold"><strong>Duration:</strong> {session.duration} {(session.duration > 1) ? "Hours" : "Hour"}</p>
                <p className="text-gray-400 dark:text-gray-300 font-bold"><strong>Capacity:</strong> {session.capacity}</p>
                <p className="text-gray-400 dark:text-gray-300 font-bold"><strong>Price:</strong> {session.price + " $"}</p>
                {/* Show "Already Joined", "Full", or "Join Session" */}
                <Button
                      variant="contained"
                        onClick={() => addToParticipated(session)}
                        className="bg-blue-600 text-white  hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
                        disabled={isFull || isJoined} // Disable if full or already joined
                      >
                        {isJoined ? (
                          <p className="font-bold dark:text-white">Already Joined</p>
                        ) : isFull ? (
                          <p className="font-bold dark:text-white">Full</p>
                        ) : (
                          <p>Join Session</p>
                        )}
                      </Button>
              </div>
            );
          })
        ):(
          <p  className=" text-center font-bold text-red-500 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">No Sessions Available</p>
        )}
      </div>
      {/* Desktop View - Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full rounded-lg overflow-hidden">
          <thead className="dark:bg-gray-700 bg-gray-200 dark:text-gray-300 text-gray-700">
            <tr>
              <th className="p-3 text-center">Name</th>
              <th className="p-3 text-center">Date</th>
              <th className="p-3 text-center">Duration</th>
              <th className="p-3 text-center">Capacity</th>
              <th className="p-3 text-center">Price</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="dark:bg-gray-800 bg-white divide-y divide-gray-300 dark:divide-gray-700">
            {(sessions && sessions.length > 0 ) ? (
              sessions.map((session) => {
                const isJoined = userParticipatedSessions.has(session.id);
                const isFull = session.currentParticipants >= session.capacity;
                return (
                  <tr key={session.id} className="hover:bg-gray-100 dark:hover:bg-gray-600 transition-all">
                    <td className="p-3 dark:text-white text-center">{session.name}</td>
                    <td className="p-3 dark:text-white text-center">{formatDate(session.date)}</td>
                    <td className="p-3 dark:text-white text-center">{session.duration} {(session.duration > 1) ? ("Hours"):("Hour")}</td>
                    <td className="p-3 dark:text-white text-center font-bold">{session.capacity}</td>
                    <td className="p-3 dark:text-white text-center font-bold">{session.price + " $"}</td>
                    <td className="p-3 text-center">
                      <Button
                      variant="contained"
                        onClick={() => addToParticipated(session)}
                        className="bg-blue-600 text-white  hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
                        disabled={isFull || isJoined} // Disable if full or already joined
                      >
                        {isJoined ? (
                          <p className="font-bold dark:text-white">Already Joined</p>
                        ) : isFull ? (
                          <p className="font-bold dark:text-white">Full</p>
                        ) : (
                          <p>Join Session</p>
                        )}
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
              <td colSpan="100%" className=" text-center font-bold text-red-500 p-4 bg-gray-200 dark:bg-gray-800 rounded-lg">No Sessions Available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetPT;
