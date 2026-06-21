import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { login } from '../services/AuthService'

const Login = () => {

    const navigate = useNavigate()

    const [user, setUser] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const handleLogin = async () => {

        const response = await login(user)
        const token = response.data.jwtToken
        localStorage.setItem("token", token)
        const role = response.data.userRole

        console.log("ROLE:", role)

        if (role === "ADMIN") {
            navigate("/admin/dashboard")
        }
        else if (role === "AGENT") {
            navigate("/agent/dashboard")
        }
        else {
            navigate("/customer/dashboard")
        }
    }

    return (
        <div className='login-container'>
            <h1>Insurance Portal</h1>
            <input type='email' name="email" placeholder='Email' onChange={handleChange} />
            <input type='password' name="password" placeholder='Password' onChange={handleChange} />

            <button onClick={handleLogin}>Login</button>
        </div>
    )
}

export default Login
