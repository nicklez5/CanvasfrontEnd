import React , {useState,useEffect} from 'react'
import api from '../api/courses'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { useNavigate } from 'react-router-dom'
import {Container,Form,Button,Spinner,Alert,Row,Col } from "react-bootstrap";
export default function ProfilePage() {
  const profile = useStoreState((state) => state.userStore.profile);
  const updateProfile = useStoreActions(
    (actions) => actions.userStore.updateProfile
  );
  const { loading, error, loggedIn } = useStoreState((state) => state.userStore);

  const [formData, setFormData] = useState({
    first_name: profile.first_name || '',
    last_name: profile.last_name || '',
    date_of_birth: profile.date_of_birth || '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    setFormData({
      first_name: profile.first_name || '',
      last_name: profile.last_name || '',
      date_of_birth: profile.date_of_birth || '',
    });
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProfile = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      date_of_birth: formData.date_of_birth,
    };
    await updateProfile(updatedProfile);
    if (!error) {
      navigate('/home');
    } else {
      console.error(error);
    }
  };

  // If not logged in, redirect to login (optional)
  if (!loggedIn) {
    navigate('/');
    return null;
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-body p-4">
              <h2 className="card-title text-center mb-4">Edit Profile</h2>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <Form onSubmit={handleSubmit}>
                {/* First Name */}
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="first_name"
                    className="form-control"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Last Name */}
                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="last_name"
                    className="form-control"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Date of Birth */}
                <div className="mb-4">
                  <label htmlFor="dateOfBirth" className="form-label">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="date_of_birth"
                    className="form-control"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Submit Button */}
                <div className="d-grid">
                  <button
                    type="submit"
                    className="btn1 btn-primary btn-profile"
                    disabled={loading}
                  >
                    {loading ? 'Updating...' : 'Update Profile'}
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

