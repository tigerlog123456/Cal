import { useEffect, useState } from "react";
import { doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore"; // Import Firestore methods
import { db } from "../firebase-config";

const Addrate = ({ data }) => {
  const [rate, setRate] = useState("");
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    checkIfRated();
  }, [data]);

  const checkIfRated = async () => {
    if (data[0] && data[1]) {
      const rateRef = doc(db, "AgencyRate", `${data[0].uid}_${data[1].uid}`);
      const rateSnapshot = await getDoc(rateRef);
      if (rateSnapshot.exists()) {
        setHasRated(true);
      }
    }
  };

  const handleSubmit = async () => {
    if (data[0] && data[1] && rate) {
      try {
        const rateRef = doc(db, "AgencyRate", `${data[0].uid}_${data[1].uid}`);
        await setDoc(rateRef, {
          userId: data[0].uid,
          agencyId: data[1].uid,
          rate: rate,
          timestamp: new Date(),
        });

        const agencyRef = doc(db, "users", data[1].uid);
        const agencySnapshot = await getDoc(agencyRef);
        if (agencySnapshot.exists()) {
          await updateDoc(agencyRef, {
            rate: increment(1),
          });
        }

        setHasRated(true);
        setRate("");
      } catch (error) {
        console.error("Error submitting rating:", error);
      }
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {hasRated ? (
        <p className="text-green-600 font-medium text-sm">Rated</p>
      ) : (
        <div className="flex items-center space-x-2">
          <select
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          >
            <option value="" disabled>
              Rate
            </option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm"
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
};

export default Addrate;