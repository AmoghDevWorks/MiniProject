import React from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import Home from '../components/Home'
import Profile from '../components/Profile'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Provider } from 'react-redux'
import appStore from '../utils/appStore'

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
