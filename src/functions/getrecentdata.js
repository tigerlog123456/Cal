import { useEffect, useState } from 'react';
import '../App.css';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from "../firebase-config";

const Getrecentdata = ({ data, refreshKey, Setrecent }) => {
  const [recentdata, setRecentdata] = useState([]);
  const [timestamp, settimestamp] = useState([]);

  const fetchdata = async () => {
    if (!data || !data.uid) {
      return;
    }
    try {
      const dataCollection = collection(db, 'recentData');
      const q = query(dataCollection, where('uid', '==', data.uid));
      const dataSnapshot = await getDocs(q);
      const dataList = dataSnapshot.docs.map(doc => {
        const docData = doc.data();
        const docTimestamp = docData.timestamp ? docData.timestamp.seconds * 1000 : null;
        return { ...docData, timestamp: docTimestamp };
      });
      if (dataList.length > 0) {
        setRecentdata(dataList); // Store all the fetched records
        Setrecent(dataList);
        settimestamp(dataList.map(item => new Date(item.timestamp)));
        dataList.sort((a, b) => b.timestamp - a.timestamp);
      }
    } catch (error) {
      console.error('Error fetching recent data:', error);
    }
  };

  const formatDate = (timestamp) => {
    const date = typeof timestamp === "number" ? new Date(timestamp) : timestamp;
    if (!date) return "N/A";
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleString("en-GB", options); // "en-GB" ensures DD/MM/YYYY format
  };

  useEffect(() => {
    fetchdata();
  }, [data, refreshKey]);

  return (
    <div className={`p-6 rounded-lg max-w-4xl mx-auto dark:bg-gray-900 bg-white shadow-lg`}>
    <h1 className={`font-bold text-2xl mb-6 dark:text-white text-gray-800`}>Recent Data</h1>
    {recentdata.length > 0 ? (
      <div className={`overflow-y-auto max-h-96 border rounded-lg scrollbar-thin dark:border-gray-700 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 border-gray-200 scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:bg-gray-900 bg-gray-200`}>
        {/* Header Row */}
        <div className={`hidden md:flex justify-between p-4 font-semibold dark:bg-gray-800 dark:text-white bg-gray-100 text-gray-600 sticky top-0`}>
          <div className="w-1/6 text-center">Water</div>
          <div className="w-1/6 text-center">Steps</div>
          <div className="w-1/6 text-center">Today's Weight</div>
          <div className="w-1/6 text-center">Calories Burned</div>
          <div className="w-1/6 text-center">Calories Needed</div>
          <div className="w-1/6 text-center">Date / Time</div>
        </div>
        {recentdata.map((record, index) => (
          <div key={index} className={`flex flex-col shadow-md mb-4 md:flex-row justify-between p-4 border-b dark:border-gray-700 dark:bg-gray-800 dark:text-white border-gray-200 bg-white text-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200`}>
            <div className="md:w-1/6 text-center">
              <span className="block md:hidden font-semibold">Water:</span> {record.water}
            </div>
            <div className="md:w-1/6 text-center">
              <span className="block md:hidden font-semibold">Steps:</span> {record.steps}
            </div>
            <div className="md:w-1/6 text-center">
              <span className="block md:hidden font-semibold">Today's Weight:</span> {record.todayWeight}
            </div>
            <div className="md:w-1/6 text-center">
              <span className="block md:hidden font-semibold">Calories Burned:</span> {record.caloriesburned}
            </div>
            <div className="md:w-1/6 text-center">
              <span className="block md:hidden font-semibold">Calories Needed:</span> {record.caloriesneeded}
            </div>
            <div className="md:w-1/6 text-center">
              <span className="block md:hidden font-semibold">Date / Time:</span> {record.timestamp ? formatDate(record.timestamp) : "N/A"}
            </div>
          </div>
        ))}
      </div>
      ) : (
        <p className={`text-gray-600 dark:text-gray-300 `}>No data available for this user.</p>
      )}
    </div>
  );
};

export default Getrecentdata;
