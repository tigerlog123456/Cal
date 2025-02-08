import { useEffect, useState } from "react";
import { doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore"; // Import Firestore methods
import { db } from "../firebase-config";
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
const Addrate = ({ data }) => {
  const [rate, setRate] = useState("");
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    checkIfRated();
  }, [data , hasRated , rate]);

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
    <div className="flex justify-center space-x-2">
      {hasRated ? (
        <Typography className="text-green-600 font-medium w-full text-md p-2 text-center">Rated</Typography>
      ) : (
        <div className="flex items-center space-x-2 aligm-center">
          <select
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            className="px-2 py-1 border border-gray-300 rounded dark:hover:bg-gray-800 dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          >
            <option className="text-center dark:bg-gray-800" value="" disabled>
              Rate
            </option>
            <option className="text-center dark:hover:bg-gray-800 dark:bg-gray-800" value="1">1</option>
            <option className="text-center dark:hover:bg-gray-800 dark:bg-gray-800" value="2">2</option>
            <option className="text-center dark:hover:bg-gray-800 dark:bg-gray-800" value="3">3</option>
            <option className="text-center dark:hover:bg-gray-800 dark:bg-gray-800" value="4">4</option>
            <option className="text-center dark:hover:bg-gray-800 dark:bg-gray-800" value="5">5</option>
          </select>
          <Button
          variant=""
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm hover:text-white"
          >
            Submit
          </Button>
        </div>
      )}
    </div>
  );
};

export default Addrate;