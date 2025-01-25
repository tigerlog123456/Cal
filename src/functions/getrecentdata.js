import {useEffect, useState } from 'react'
import '../App.css'
import {collection, getDocs,query, where } from 'firebase/firestore';
import { db } from "../firebase-config";


const Getrecentdata= ({data , refreshKey , Setrecent }) =>{
const [recentdata , setRecentdata] = useState([])
const [timestamp , settimestamp] = useState([])
    const fetchdata = async() =>{
        if (!data || !data.uid) {
            console.log("Invalid data or UID not found");
            return; }
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
                Setrecent(dataList)
                settimestamp(dataList.map(item => new Date(item.timestamp)));
                dataList.sort((a, b) => b.timestamp - a.timestamp);
              }
        } catch (error) { console.error('Error fetching recent data:', error); }
    }
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
    useEffect(()=>{
        fetchdata()
    },[data , refreshKey])
    return (
      //Client Dashboard Table
      
        <div className="p-4">
          <h1 className='font-bold text-xl'>Recent Data</h1>
      {recentdata.length > 0 ? (
        recentdata.map((record, index) => (
          <div key={index} className="overflow-x-auto mb-6">
            {/* Row 1: Headers */}
            <div className="flex justify-between p-2 font-bold">
              <div className="w-1/6">Water</div>
              <div className="w-1/6">Steps</div>
              <div className="w-1/6">Today's Weight</div>
              <div className="w-1/6">Calories Burned</div>
              <div className="w-1/6">Calories Needed</div>
              <div className="w-1/6">Date / Time</div>
            </div>
            {/* Row 2: Values */}
            <div className="flex justify-between p-2">
              <div className="w-1/6">{record.water}</div>
              <div className="w-1/6">{record.steps}</div>
              <div className="w-1/6">{record.todayWeight}</div>
              <div className="w-1/6">{record.caloriesburned}</div>
              <div className="w-1/6">{record.caloriesneeded}</div>
              <div className="w-1/6">
                {record.timestamp ? formatDate(record.timestamp) : "N/A"}
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>No data available for this user.</p>
      )}
    </div>
    )
}
export default Getrecentdata