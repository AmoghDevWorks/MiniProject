import React from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import Home from '../components/Home'
import Profile from '../components/Profile'
import Navbar from '../utils/Navbar'
import Footer from '../utils/Footer'

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
        path:'/profile',
        element:<Profile />
      }
    ]
  }
])


const App = () =>{
  return(
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App
