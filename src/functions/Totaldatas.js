import { useEffect, useState } from "react"
const Totaldatas = ({data , recentdata , refreshKey}) =>{
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
    return(
        <div className="p-4">
            <h1 className="font-bold text-xl">Totals</h1>
            {recentdata && recentdata.length > 0 && (
                <>
                    <p>Total Calories Burned: {totalCalories}</p>
                    <p>Total Water Consumed: {totalWater}</p>
                    <p>Total Entries: {totalCalculations}</p>
                </>
            )}
            
        </div>
    )
}
export default Totaldatas