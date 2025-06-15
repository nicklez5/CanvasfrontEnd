import React , {useState,useEffect} from 'react'
import api from '../../api/courses'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { useNavigate } from 'react-router-dom'
import {Container,Form,Button,Spinner,Alert,Row,Col } from "react-bootstrap";
const UserSettings = () => {
  const user = useStoreState((state) => state.userStore.user)
  const updateUsernameAndProfile = useStoreActions((a) => a.userStore.updateUsernameAndProfile)
  const updateUserPassword = useStoreActions((a) => a.userStore.updateUserPassword)
  const { loading , error} = useStoreState((s) => s.userStore)
  const [profileUpdatedSuccess, setProfileUpdatedSuccess] = useState('')
  const [profileUpdatedError, setProfileUpdatedError] = useState(null)
  const [pwdError, setPwdError] = useState(null)
  const [pwdSuccess, setPwdSuccess] = useState('')
  const [formData, setFormData] = useState({
    email: user.email || '',
    username: user.username || '',
  });
  const [formData1, setFormData1] = useState({
    currentPassword : "",
    newPassword: "",
    confirmNewPassword: ""
  })
   useEffect(() => {
    setFormData({
      email: user.email || '',
      username: user.username || '',
    })
  }, [user]);
  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }))
  }
  const handleProfileSubmit = async(e) => {
    e.preventDefault();
    setProfileUpdatedError(null)
    setProfileUpdatedSuccess("")
    if(!formData.username.trim() || !formData.email.trim()){
      setProfileUpdatedError("Username and email cannot be empty")
      return
    }
    const result = await updateUsernameAndProfile({username1: formData.username, email1: formData.email})
    if(result.success){
      setProfileUpdatedSuccess("Profile has been updated successfully")
    }else{
      setProfileUpdatedError(result.error)
    }
  }
  const handleChange2 = (e) => {
    const {name, value} = e.target
    setFormData1(prev => ({
      ...prev,
      [name]: value
    }))
  }
  const handlePasswordSubmit = async(e) => {
    e.preventDefault()
    setPwdError(null)
    setPwdSuccess("")
    if(formData1.newPassword !== formData1.confirmNewPassword){
      setPwdError("New password and confirmation must match")
      return
    }
    if(!formData1.currentPassword || !formData1.newPassword){
      setPwdError("Please fill out both password fields.")
      return
    }
    const result = await updateUserPassword({currentPw: formData1.currentPassword, newPw: formData1.newPassword, confirmNewPw: formData1.confirmNewPassword})
    if(result.success){
      setPwdSuccess("Password change successfully")
      setFormData1({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
      })
    }else{
      setPwdError(result.error)
    }
  }
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">
                  Edit User Settings
              </h2>
              <Form onSubmit={handleProfileSubmit} className="mb-3">
                {profileUpdatedError && (
                  <Alert variant="danger" className="mb-3">
                    {typeof profileUpdatedError === "string" 
                      ? profileUpdatedError 
                      : JSON.stringify(profileUpdatedError)
                    }
                  </Alert>
                )}
                {profileUpdatedSuccess && (
                  <Alert variant="success" className="mb-3">
                    {profileUpdatedSuccess}
                  </Alert>
                )}
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="pk" className="mb-3">
                      <Form.Label>PK (User ID)</Form.Label>
                      <Form.Control type="text" disabled={true} readOnly defaultValue={user.pk}/>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="role" className="mb-3">
                      <Form.Label>Role</Form.Label>
                      <Form.Control
                        disabled={true}
                        type="text"
                        readOnly
                        defaultValue={user.is_staff ? "Staff" : "Student"}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group controlId="username" className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    />
                </Form.Group>
                <Form.Group controlId="email" className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    />
                </Form.Group>
                <Button variant="primary" type="submit" style={{width: "200px", marginLeft: "170px",marginTop:"10px"}} disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Saving
                  </>
                ) : (
                  "Save Changes"
                )}
                </Button>
              </Form>
              <Form onSubmit={handlePasswordSubmit}>
                <h4 className="card-title text-center me-3">Change Password</h4>
                {pwdError && (
                  <Alert variant="danger" className="mb-3">
                    {typeof pwdError === "string" ? pwdError : JSON.stringify(pwdError)}
                  </Alert>
                )}
                {pwdSuccess && (
                  <Alert variant="success" className="mb-3">
                    {pwdSuccess}
                  </Alert>
                )}
                <Form.Group controlId="currentPassword" className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter current password"
                    value={formData1.currentPassword}
                    onChange={handleChange2}
                    name="currentPassword"
                    required
                    />
                </Form.Group>
                <Form.Group controlId="newPassword" className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter new password"
                    value={formData1.newPassword}
                    onChange={handleChange2}
                    name="newPassword"
                    required
                    />
                </Form.Group>
                <Form.Group controlId="confirmNewPassword" className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm new password"
                    value={formData1.confirmNewPassword}
                    onChange={handleChange2}
                    name="confirmNewPassword"
                    required
                    />
                </Form.Group>
                <Button variant="outline-primary" type="submit" style={{width: "200px" , marginLeft: "170px",marginTop:"10px"}} disabled={loading}>
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Changing…
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default UserSettings