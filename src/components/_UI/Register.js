import React , {useState}from 'react'
import axios from "axios"
import { useStoreState,useStoreActions } from 'easy-peasy'
import { Link,useNavigate, Navigate } from 'react-router-dom'
import { Container, Form, Button, Spinner, Alert } from "react-bootstrap";
const Register = () => {
  const navigate = useNavigate()
  const {loading, error,user} = useStoreState((state) => state.userStore)
  const register = useStoreActions((actions) => actions.userStore.register)
  const [username, setUsername] = useState('')
  const [email,setEmail] = useState('')
  const [password, setPassword] = useState("")
  const [password2,setPassword2] = useState('')
  const [role, setRole] = useState("Student");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      username,
      email,
      password,
      password2,
      role, // "Student" or "Staff"
    };
    const result = await register(payload);
    if (result.success) {
      // Optionally, redirect to home or profile
      navigate("/login");
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
            <h2 className="card-title text-center mb-4">Register</h2>

      {error && (
        <Alert variant="danger" className="mb-3">
          {typeof error === "string" ? error : JSON.stringify(error)}
        </Alert>
      )}

      <Form onSubmit={handleSubmit} style={{position: "relative",color: "black",marginBottom:"3rem", top: "20px"}}>
        {/* Username */}
        <Form.Group controlId="regUsername" className="mb-4">
          <Form.Label>Username</Form.Label>
          <Form.Control
            style={{marginLeft: "4px"}}
            type="text"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Form.Group>

        {/* Email */}
        <Form.Group controlId="regEmail" className="mb-4">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            style={{marginLeft: "4px"}}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>

        {/* Password */}
        <Form.Group controlId="regPassword" className="mb-4">
          <Form.Label>Password</Form.Label>
          <Form.Control
            style={{marginLeft: "4px"}}
            type="password"
            placeholder="Choose a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        {/* Confirm Password */}
        <Form.Group controlId="regPassword2" className="mb-4">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            style={{marginLeft: "4px"}}
            type="password"
            placeholder="Re‐enter password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
        </Form.Group>

        {/* Role Dropdown */}
        <Form.Group controlId="regRole" className="mb-4">
          <Form.Label>Select Role</Form.Label>
          <Form.Select
            style={{marginLeft: "4px"}}
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="Student">Student</option>
            <option value="Staff">Staff</option>
          </Form.Select>
        </Form.Group>

        {/* Submit Button */}
        <Button variant="primary" type="submit" style={{marginTop: "2rem",width: "250px", marginLeft: "160px" }}disabled={loading}>
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Registering…
            </>
          ) : (
            "Register"
          )}
        </Button>
      </Form>
        </div>
        </div>
        </div>
      </div>
    </div>
  );
};


export default Register