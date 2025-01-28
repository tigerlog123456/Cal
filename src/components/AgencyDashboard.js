import { useState } from 'react'
import '../App.css'
import Agencyclients from '../functions/agencyclients'
const AgencyDashboard = ({data})=>{
const [client  , setClient] = useState([])

return(

    <div className='mt-14'>
      <Agencyclients data={data} setClient={setClient}/>
    </div>
)
}
export default AgencyDashboard