import {useEffect, useState } from "react"
import { db } from '../firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import '../App.css'
const Addrecentdata = ({data}) =>{
    const [steps , setsteps] = useState("")
    const [todayweight , settodayweight] = useState("")
    const [water , setwater] = useState("")
    const [caloriesburned , setcaloriesburned] = useState(0)
    const [caloriesneeded , setcaloriesneeded] = useState(0)
    const calculation = async() =>{
        const validateInputs = () => {
            // Ensure all fields are greater than 10
            if (steps <= 10 || todayweight <= 10 || water <= 10) {
                return false;
            }
            return true;
        };
        if (!data) return { caloriesBurned: 0, caloriesNeeded: 0 };
        // Calculate BMR (Basal Metabolic Rate) for men
        if (!validateInputs()) return;
            const bmr = 10 * data.weight + 6.25 * data.weight - 5 * data.age + 5;
        // Calculate calories burned based on steps and water intake
        const calculatedCaloriesBurned = bmr + (steps * 0.04) + (water * 0.1);
        // Calculate calories needed to reach target weight
        const targetBmr = 10 * data.targetWeight + 6.25 * data.height - 5 * data.age + 5;
        setcaloriesburned(parseFloat(calculatedCaloriesBurned.toFixed(0)),)
        setcaloriesneeded(parseFloat(targetBmr.toFixed(0)))
         const updateddata = {
            uid: data.uid,
            steps:steps,
            todayWeight: todayweight,
            water:water ,
            caloriesburned : parseFloat(calculatedCaloriesBurned.toFixed(0)),
            caloriesneeded : parseFloat(targetBmr.toFixed(0)),
            timestamp: new Date()
        };
      if (!updateddata || Object.keys(updateddata).length === 0) {
            console.log("No valid data to save.");
            return;  
        }  
        try {
        await addDoc(collection(db, 'recentData'), updateddata);
    } catch (error) {
        console.error('Error saving data:', error);
    }
    }
    useEffect(() => {
    }, [caloriesburned, caloriesneeded ]); 
    return(
        //Client Dashboard Inputs
        <div className="p-4">
            <h1 className="font-bold text-xl">Daily Data</h1>
             <input
                type="number"
                placeholder="todayweight"
                value={todayweight}
                onChange={(e) => settodayweight(e.target.value)}
            />
            <input
                type="number"
                placeholder="water"   
                value={water}
                onChange={(e) => setwater(e.target.value)}
            />
            <input
                type="number"
                placeholder="steps"        
                value={steps}
                onChange={(e) => setsteps(e.target.value)}
            />
            <button onClick={calculation}>
                Calculate
            </button>
        </div>
    )
}


export default Addrecentdata