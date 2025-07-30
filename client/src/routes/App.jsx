import React from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import Home from '../components/Home'
import Profile from '../components/Profile'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Provider } from 'react-redux'
import appStore from '../utils/appStore'
import Auth from '../auth/auth'
import AdminSignIn from '../admin/AdminSignIn'
import FarmerSignIn from '../farmer/FarmerSignIn'
import FarmerSignUp from '../farmer/FarmerSignUp'
import TechnicianSignUp from '../technician/TechnicianSignUp'
import TechnicianSignIn from '../technician/TechnicianSignIn'

const Structure = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

const router = createBrowserRouter([
  {
    path:'/',
    element:<Structure />,
    children:[
      {
        path:'/',
        element:<Home />
      },
      {
        path:'/profile',
        element:<Profile />
      },
      {
        path:'/auth',
        element:<Auth />
      },
      {
        path:'/adminSignIn',
        element:<AdminSignIn />
      },
      {
        path:'/farmerSignIn',
        element:<FarmerSignIn />
      },
      {
        path:'/farmerSignUp',
        element:<FarmerSignUp />
      },
      {
        path:'/technicianSignUp',
        element:<TechnicianSignUp />
      },
      {
        path:'/techicianSignIn',
        element:<TechnicianSignIn />
      }
    ]
  }
])


const App = () =>{
  return(
    <div>
      <Provider store={appStore}>
          <RouterProvider router={router} />
      </Provider>
    </div>
  )
}

export default App
