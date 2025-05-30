import React , {useState}from 'react'
import axios from "axios"
import { useStoreState,useStoreActions } from 'easy-peasy'
import { useNavigate } from 'react-router-dom'
const Register = () => {
  const [username, setUsername] = useState('')
  const [email,setEmail] = useState('')
  const [password, setPassword] = useState("")
  const [password2,setPassword2] = useState('')
  const {loading, error} = useStoreState((state) => state.userStore)
  const register = useStoreActions((actions) => actions.userStore.register)
  const navigate = useNavigate()
  const handleSubmit = async(e) => {
    e.preventDefault()
    if(password !== password2){
      alert('Passwords do not match');
      return;
    }
    const userData = {
      username,
      email,
      password,
      password2
    }
    await register(userData)
    if(!error){
      navigate("/")
    }else{
      console.error(error)
    }
    
  }
  return (
    <div className="registerForm">
      <h2>Create an Account</h2>
      {error && <p style={{color: "red"}}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{marginTop: "23px", paddingBottom: "30px"}}>
          <label htmlFor="username" style={{position: "relative", left: "25px", fontWeight: "bolder"}}>Username:</label>
          <input
            style={{position: "relative",padding: "10px", marginLeft: "15px",paddingRight: "100px",left: "40px"}}
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            />
        </div>
        <div style={{marginTop: "15px", paddingBottom: "30px"}}>
          <label htmlFor="email" style={{position: "relative", left: "45px",fontWeight: "bolder"}}>Email:</label>
          <input
             style={{position: "relative",padding: "10px", marginLeft: "15px",paddingRight: "100px",left: "80px"}}
             type="email"
             id="email"
             value={email}
             onChange={(e) => setEmail(e.target.value)}
             required
             />
        </div>
        <div style={{marginTop: "15px", paddingBottom: "30px"}}>
          <label htmlFor="password" style={{position: "relative", left: "25px",fontWeight: "bolder"}}>Password:</label>
          <input
            style={{position: "relative",padding: "10px",marginLeft: "15px",paddingRight: "100px", left: "50px"}}
             type="password"
             id="password"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
             required
             />
        </div>
        <div style={{marginTop: "15px", paddingBottom: "30px"}}>
          <label htmlFor="password2" style={{position: "relative",left: "-35px",fontWeight: "bolder" }}>Confirm Password:</label>
          <input
            style={{position: "relative",padding: "10px",marginLeft: "-15px",paddingRight: "100px",left: "15px"}}
            type="password"
            id="password2"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
        </div>
        <button className="submitBtn" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  )
}

export default Register