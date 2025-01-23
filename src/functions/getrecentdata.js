import {useEffect, useState } from 'react'
import '../App.css'
import {collection, getDocs,query, where } from 'firebase/firestore';
import { db } from "../firebase-config";


const Getrecentdata= ({data , selecteduser}) =>{
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
                settimestamp(dataList.map(item => new Date(item.timestamp)));
              }
        } catch (error) { console.error('Error fetching recent data:', error); }
    }
    useEffect(()=>{
        fetchdata()
    },[data])

    return (
      //Client Dashboard Table

        <div className="p-4">
      {recentdata.length > 0 ? (
        recentdata.map((record, index) => (
          <div key={index} className="overflow-x-auto mb-6">
            {/* Row 1: Headers */}
            <div className="flex justify-between p-2 font-bold">
              <div className="w-1/6">Water</div>
              <div className="w-1/6">Steps</div>
              <div className="w-1/6">Calories Burned</div>
              <div className="w-1/6">Today's Weight</div>
              <div className="w-1/6">Calories Needed</div>
              <div className="w-1/6">Timestamp</div>
            </div>
            {/* Row 2: Values */}
            <div className="flex justify-between p-2">
              <div className="w-1/6">{record.water}</div>
              <div className="w-1/6">{record.steps}</div>
              <div className="w-1/6">{record.caloriesburned}</div>
              <div className="w-1/6">{record.todayWeight}</div>
              <div className="w-1/6">{record.caloriesneeded}</div>
              <div className="w-1/6">{timestamp[index] ? timestamp[index].toString() : 'N/A'}</div>
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