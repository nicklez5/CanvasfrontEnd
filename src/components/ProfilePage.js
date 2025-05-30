import React , {useState,useEffect} from 'react'
import api from '../api/courses'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { useNavigate } from 'react-router-dom'

const ProfilePage = () => {
    const profile = useStoreState((state) => state.userStore.profile)
    const updateProfile = useStoreActions((actions) => actions.userStore.updateProfile)
    const {loading, error} = useStoreState((state) => state.userStore)
    const [formData, setFormData] = useState({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        date_of_birth: profile.date_of_birth || ""
    })
   const navigate = useNavigate()
    useEffect(() => {
        setFormData({
            first_name: profile.first_name || "",
            last_name: profile.last_name || "",
            date_of_birth: profile.date_of_birth || ""
        })
    },[profile])
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }));
    }
    const handleSubmit = async(e) => {
         e.preventDefault()
        const updatedProfile = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            date_of_birth:formData.date_of_birth
        }
        await updateProfile(updatedProfile)
        if(!error){
            navigate("/home")
        }else{
            console.error(error)
        }
    }
  return (
     <div className="profile-page">
      <h2>Edit Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form style={{display: "flex", flexDirection:"column"}}onSubmit={handleSubmit}>

        <div style={{marginTop: "23px", paddingBottom: "15px"}}>
          <label htmlFor="first_name" style={{position: "relative", left: "25px",fontWeight: "bolder"}}>First Name:</label>
          <input
            style={{position: "relative",padding: "10px", marginLeft: "15px",paddingRight: "100px",left: "40px"}}
            type="text"
            id="firstName"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{marginTop: "15px", paddingBottom: "15px"}}>
          <label htmlFor="last_name" style={{position: "relative", left: "25px",fontWeight: "bolder"}}>Last Name:</label>
          <input
            style={{position: "relative",padding: "10px", marginLeft: "15px",paddingRight: "100px",left: "40px"}}
            type="text"
            id="lastName"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={{marginTop: "15px", paddingBottom: "15px"}}>
          <label htmlFor="dateOfBirth" style={{position: "relative", left: "15px",fontWeight: "bolder"}}>Date of Birth:</label>
          <input
            style={{position: "relative",padding: "10px",marginLeft: "15px",paddingRight: "150px", left: "20px"}}
            type="date"
            id="dateOfBirth"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            required
          />
        </div>

        <button className="submitBtn" type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  )
}

export default ProfilePage