import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import MainLayout from './components/layouts/MainLayout'
import UserProvider from './context/userContext'

function App() {

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "login",
          element: <Login />
        },
        {
          path: "signup",
          element: <Signup />
        }
      ]
    }
  ])

  return (
    <>
      <UserProvider>
        <RouterProvider router={appRouter} />
      </UserProvider>
    </>
  )
}

export default App
