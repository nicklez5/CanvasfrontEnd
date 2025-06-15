import { React, useState} from 'react'
import axios from 'axios';
import { useNavigate, Link , Navigate} from "react-router-dom"
import Swal from 'sweetalert2';
import { useStoreActions, useStoreState } from 'easy-peasy';
import Home from './Home';
import Header from '../Header'; 
import styled from 'styled-components';
const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const fetchUser = useStoreActions((actions) => actions.userStore.fetchUser)
  const loggedIn = useStoreState((state) => state.userStore.loggedIn)
  const {error} = useStoreState((state) => state.userStore)
  const login = useStoreActions((actions) => actions.userStore.fetchUser);
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const success = await login({ email, password });
      if(!success){
        navigate('/login')
      }else{
         navigate('/home');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // If already logged in, redirect to home
  if (loggedIn) {
    return <Navigate to="/home" replace />;
  }
  
  return (
    <div className="container">
      {/* Push the form down by ~10% of the viewport height on large screens */}
      <div className="row justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="col-12 col-md-6 col-lg-4">
          <form onSubmit={handleLogin} className="shadow-sm p-4 rounded bg-white">
            <h2 className="mb-3 text-center">Login to Your Account</h2>
            <p className="text-center text-muted mb-4">Welcome back!</p>
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-control"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="btn1 btn-primary w-100 mb-3 btn-login">
              Log In
            </button>

            <div className="text-center">
              <small className="text-muted">
                Don’t have an account?{' '}
                <Link to="/register" className="text-decoration-none">
                  Create one
                </Link>
              </small>
            </div>
            <div className="text-center">
              <small className="text-muted">
                
                <Link to="/forgotPassword" className="text-decoration-none">
                  Forgot Password?
                </Link>
              </small>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage