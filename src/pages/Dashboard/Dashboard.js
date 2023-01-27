import React from 'react'
import DashboardComponent from "../../components/Dashboard/Dashboard"
import { UsersProvider } from '../../context/UsersContext';


const Dashboard = () => {

    return (
        
        <>
             <UsersProvider>
                <DashboardComponent />
             </UsersProvider>
        </>
       

    )
}

export default Dashboard
