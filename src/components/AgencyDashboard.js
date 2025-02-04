import { useState } from 'react'
import '../App.css'
import Agencyclients from '../functions/agencyclients'
import Transactiondata from '../functions/Transactiondata'
import PT from '../functions/Personalsessions'
const AgencyDashboard = ({data})=>{
const [client  , setClient] = useState([])

return(

    <div className='mt-10 md:mt-14'>
      
      <Agencyclients data={data} setClient={setClient}/> 
      <PT data={data}/>
      <Transactiondata data={data}/>
     
    </div>
)
}
export default AgencyDashboard