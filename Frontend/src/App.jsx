import { useContext, useState } from 'react'
import './App.css'
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'
import UserProvider, { UserContext } from './context/userContext'
import Dashboard from './pages/Admin/Dashboard'
import PrivateRoute from './Routes/PrivateRoute'
import ManageTasks from './pages/Admin/ManageTasks'
import CreateTask from './pages/Admin/CreateTask'
import ManageUsers from './pages/Admin/ManageUsers'
import UserDashboard from './pages/User/UserDashboard'
import MyTasks from './pages/User/MyTasks'
import ViewTaskDetails from './pages/User/ViewTaskDetails'


function App() {
  
  return (
    <>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path='/signup' element={<Signup />} />

            <Route path='/admin' element={<PrivateRoute allowedRoles={["admin"]} />} >
              <Route path='dashboard' element={<Dashboard />} />
              <Route path='tasks' element={<ManageTasks />} />
              <Route path='create-task' element={<CreateTask />} />
              <Route path='users' element={<ManageUsers />} />
            </Route>

            <Route path='/user' element={<PrivateRoute allowedRoles={["member"]} />} >
              <Route path='dashboard' element={<UserDashboard />} />
              <Route path='tasks' element={<MyTasks />} />
              <Route path='task-details/:id' element={<ViewTaskDetails />} />
            </Route>

            <Route path='/' element={<Root />} />

          </Routes>
        </Router>
      </UserProvider>
    </>
  )
}

export default App

const Root = () => {
  const { user, loading } = useContext(UserContext)

  if (loading) return <div>Loading...</div>

  if (!user) return <Navigate to="/login" />

  return user.role === "admin" ? <Navigate to="/admin/dashboard" /> : <Navigate to="/user/dashboard" />
}