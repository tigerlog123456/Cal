import { useState } from 'react'
import '../App.css'
import Agencyclients from '../functions/agencyclients'
import Transactiondata from '../functions/Transactiondata'
import PT from '../functions/Personalsessions'
import ChatModule from '../functions/chatmodule'
const AgencyDashboard = ({data})=>{
const [client  , setClient] = useState([])

return(
    <div className=''>
      <Agencyclients data={data} setClient={setClient} /> 
      <PT data={data}/>
      <Transactiondata data={data}/>
      <div>
            <ChatModule data={data}/>
          </div>
    </div>
)
}
export default AgencyDashboard