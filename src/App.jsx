import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/AdminDashboard'
import AgentDashboard from './pages/AgentDashboard'
import CustomerDashboard from './pages/CustomerDashboard'
import './App.css'
const App = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
      <Route path='/agent/dashboard' element={<AgentDashboard/>}/>
      <Route path='/customer/dashboard' element={<CustomerDashboard/>}/>

    </Routes>
    </>
  )
}

export default App
