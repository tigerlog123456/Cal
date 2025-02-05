import { useEffect, useState } from "react";

const Totaldatas = ({ recentdata, refreshKey }) => {
  const [totalCalories, setTotalCalories] = useState(0);
  const [totalWater, setTotalWater] = useState(0);
  const [totalCalculations, setTotalCalculations] = useState(0);

  useEffect(() => {
    if (recentdata && recentdata.length > 0) {
      const totalCaloriesBurned = recentdata.reduce((total, item) => total + item.caloriesburned, 0);
      const totalWaterConsumed = recentdata.reduce((total, item) => total + parseInt(item.water), 0);
      const totalCount = recentdata.length;
      setTotalCalories(totalCaloriesBurned);
      setTotalWater(totalWaterConsumed);
      setTotalCalculations(totalCount);
    }
  }, [recentdata, refreshKey]);

  return (
    <div className="p-4">
        
      {recentdata && recentdata.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold">Calories Burned</h2>
            <p className="text-2xl font-bold">{totalCalories}</p>
          </div>
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold">Water Consumed</h2>
            <p className="text-2xl font-bold">{totalWater} L</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Totaldatas;
