import '../App.css'
import Admin from '../functions/admindata'
import AdminTransaction from '../functions/AdminTransactions'
const AdminDashboard = (data)=>{

    return(
        <div>
            <Admin data={data} />
            <AdminTransaction data={data}/>
        </div>
    )
    }
    export default AdminDashboard