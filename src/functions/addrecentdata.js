import { useEffect, useState } from "react";
import { db } from '../firebase-config';
import { collection, addDoc } from 'firebase/firestore';

const Addrecentdata = ({ data, onDataAdded, darkMode }) => {
  const [steps, setSteps] = useState("");
  const [todayWeight, setTodayWeight] = useState("");
  const [water, setWater] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [caloriesNeeded, setCaloriesNeeded] = useState(0);

  const calculation = async () => {
    const validateInputs = () => {
      if (steps < 10 || todayWeight < 10 || water < 0) {
        return false;
      }
      return true;
    };

    if (!data) return;
    if (!validateInputs()) return;

    const bmr = 10 * data.weight + 6.25 * data.weight - 5 * data.age + 5;
    const calculatedCaloriesBurned = bmr + steps * 0.04 + water * 0.1;
    const targetBmr = 10 * data.targetWeight + 6.25 * data.height - 5 * data.age + 5;

    setCaloriesBurned(parseFloat(calculatedCaloriesBurned.toFixed(0)));
    setCaloriesNeeded(parseFloat(targetBmr.toFixed(0)));

    const updatedData = {
      uid: data.uid,
      steps: steps,
      todayWeight: todayWeight,
      water: water,
      caloriesburned: parseFloat(calculatedCaloriesBurned.toFixed(0)),
      caloriesneeded: parseFloat(targetBmr.toFixed(0)),
      timestamp: new Date(),
    };

    if (!updatedData || Object.keys(updatedData).length === 0) {
      console.log("No valid data to save.");
      return;
    }

    try {
      await addDoc(collection(db, 'recentData'), updatedData);
      onDataAdded();
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  useEffect(() => {}, [caloriesBurned, caloriesNeeded]);

  return (
    <div className={`p-6 shadow-lg rounded-lg max-w-md mx-auto dark:bg-gray-900 dark:text-white  bg-white text-gray-800`}>
      <h1 className="text-2xl font-bold mb-4">Daily Data</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Water (liters)</label>
          <input
            type="number"
            placeholder="Enter water intake"
            value={water}
            onChange={(e) => setWater(e.target.value)}
            className={`w-full px-4 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Steps</label>
          <input
            type="number"
            placeholder="Enter steps taken"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            className={`w-full px-4 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white  border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Today’s Weight (kg)</label>
          <input
            type="number"
            placeholder="Enter today’s weight"
            value={todayWeight}
            onChange={(e) => setTodayWeight(e.target.value)}
            className={`w-full px-4 py-2 border dark:border-gray-600 dark:bg-gray-700 dark:text-white border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none`}
          />
        </div>
      </div>

      <button
        onClick={calculation}
        className={`mt-6 w-full py-2 px-4 rounded-lg dark:bg-blue-600 dark:text-white bg-blue-500 text-white hover:bg-blue-600 transition-colors`}
      >
        Calculate
      </button>

      {caloriesBurned > 0 && caloriesNeeded > 0 && (
        <div className={`mt-6 p-4 rounded-lg  dark:bg-gray-700 dark:text-white bg-gray-100 text-gray-700`}>
          <p>Calories Burned: <span className="font-bold">{caloriesBurned}</span></p>
          <p>Calories Needed: <span className="font-bold">{caloriesNeeded}</span></p>
        </div>
      )}
    </div>
  );
};

export default Addrecentdata;
