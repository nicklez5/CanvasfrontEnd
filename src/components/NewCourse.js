import { useStoreActions } from 'easy-peasy';
import React, {useState} from 'react'
import { useNavigate} from "react-router-dom"
const NewCourse = () => {
  const navigate = useNavigate()
  const [courseName, setCourseName] = useState('')
  const [loading, setLoading] = useState(false); // For handling loading state
  const [error, setError] = useState(''); // To display any error message
  const [success, setSuccess] = useState('');
  const  createCourse = useStoreActions((actions) => actions.courseStore.createCourse)
  const handleSubmit = async(e) => {
    e.preventDefault();

    createCourse({name: courseName})
    navigate('/courses')
  }
  return (
    <div className="NewCourse">
      <h2>New Course</h2>
      <form className="newPostForm" onSubmit={handleSubmit}>
        <label htmlFor="courseName">Course Name: <input
              id="courseName"
              type="text"
              required
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
          /></label>
        <br/>
          
      <br/>
      <button type="submit" style={{marginTop: "10px", position: "relative", left: "105px", padding: "10px", borderRadius: "10px", color: "white", backgroundColor: "#3CB35A"}} disabled={loading}>
          {loading ? 'Creating...' : 'Create Course'}
        </button>
      </form>
       {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      </div>
  )
}

export default NewCourse