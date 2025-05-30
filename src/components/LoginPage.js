import { React, useState} from 'react'
import axios from 'axios';
import { useNavigate, Link} from "react-router-dom"
import Swal from 'sweetalert2';
import { useStoreActions, useStoreState } from 'easy-peasy';
import Home from './Home';
import styled from 'styled-components';
const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const fetchUser = useStoreActions((actions) => actions.userStore.fetchUser)
  const loggedIn = useStoreState((state) => state.userStore.loggedIn)
  async function handleLogin(e){
    e.preventDefault()
    try{
        const user = await fetchUser({email,password})
        if(user === undefined){
            alert('Wrong Credentials');
        }else{
            navigate('/home')
        }
        console.log('Logged in as user:', JSON.stringify(user))
    }catch(error){
        alert('Wrong ');
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.response.data.message
        })
    }
  }
  
  return (
    <>
    {loggedIn === false ? (
    <div className="container" style={{marginTop: "10vh"}}>
         <form onSubmit={handleLogin}>
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
            <button type="submit" className="btn" >Log in</button>
            <p style={{marginTop: "2vh", marginLeft: "4vh"}}>Don't have an account?<Link to={'/register'}>Create an account</Link></p>
        </form> 
    </div> ) : <Home/> }
    </>
  )
}

export default LoginPage