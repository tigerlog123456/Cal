import { useEffect, useState } from 'react'
import '../App.css'
import SpecificUser from '../functions/specifecUser'
import Agencyclients from '../functions/agencyclients'
const AgencyDashboard = ({data})=>{
   
return(

    <div className='mt-14'>
      <Agencyclients data={data}/>
    </div>
)
}
export default AgencyDashboard