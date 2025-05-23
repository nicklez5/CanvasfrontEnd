import { React, useState} from 'react'
import axios from 'axios';
import { useNavigate, Link} from "react-router-dom"
import Swal from 'sweetalert2';
import Home from './Home';
const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  async function handleLogin(e){
    e.preventDefault()
    try{
        const requestBody = {email,password}
        const response = await axios.post('http://localhost:8000/users/login/',requestBody)
        console.log(response)
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("pk", response.data.user_id)
        navigate('/home')
    }catch(error){
        console.log(error);
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.message
        })
    }
  }
  return (
    <div className="container" style={{marginTop: "10vh"}}>
        {localStorage.getItem("token") !== "" ? <form onSubmit={handleLogin}>
            <h2>Login to your Account</h2>
            <p>Welcome back!</p>
            <div className="mb-3">
                <label htmlFor="email" className="form-label">Email address: </label>
                <input onChange={e => {setEmail(e.target.value)}} type="email" className="form-control" id="email"/>
            </div>
            <div className="mb-3">
                <label htmlFor="password" className="form-label2">Password: </label>
                <input onChange={e => {setPassword(e.target.value)}} type="password" className="form-control2" id="password" />
            </div>
            <button type="submit" className="btn">Log in</button>
            <p style={{marginTop: "2vh", marginLeft: "4vh"}}>Don't have an account?<Link to={'/register'}>Create an account</Link></p>
        </form> : <div><Home/></div>}
    </div>
  )
}

export default LoginPage