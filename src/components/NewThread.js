import { useStoreActions, useStoreState } from 'easy-peasy';
import React, {useState} from 'react'
import { useNavigate, useParams} from "react-router-dom"
const NewThread = () => {
  const navigate = useNavigate()
  const {courseID} = useParams()
  const [title,setTitle] = useState('')
  const {error,loading} = useStoreState((state) => state.threadStore)
  const  createThread = useStoreActions((actions) => actions.threadStore.createThread)
  const {courseStoreActions} = useStoreActions((actions) => actions.courseStore)
  const fetchCourseDetails = useStoreActions((actions) => actions.courseStore.fetchCourseDetails)
  const handleSubmit = async(e) => {
    e.preventDefault();
    const newThread = {title: title}
    try{
        await createThread({threadData: newThread, id: courseID, courseStoreActions})
        fetchCourseDetails(courseID);
        navigate(`/courses/${courseID}`)
    }catch(error){
        console.error("Error creating the thread:",error)
    }
    
  }
  return (
    <div className="NewThread">
      <h2>New Thread</h2>
      <form className="newPostForm" onSubmit={handleSubmit}>
        <label htmlFor="threadTitle">Thread title: <input
              id="threadTitle"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
          /></label>
        <br/>
          
      <br/>
      <button type="submit" style={{marginTop: "10px", position: "relative", left: "105px", padding: "10px", borderRadius: "10px", color: "white", backgroundColor: "#3CB35A"}} disabled={loading}>
          {loading ? 'Creating...' : 'Create Thread'}
        </button>
      </form>
       {error && <p className="error">{error}</p>}
      </div>
  )
}

export default NewThread