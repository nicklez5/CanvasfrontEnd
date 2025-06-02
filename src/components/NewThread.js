import { useStoreActions, useStoreState } from 'easy-peasy';
import React, {useState , useEffect} from 'react'
import { useNavigate, useParams} from "react-router-dom"
const NewThread = () => {
  const navigate = useNavigate()
  const {id} = useParams()
  const [title,setTitle] = useState('')
  const {error,loading} = useStoreState((state) => state.threadStore)
  const  createThread = useStoreActions((actions) => actions.threadStore.createThread)
  const getCoursesById = useStoreState((state) => state.courseStore.getCoursesById)
  const course = getCoursesById(id)
  const {addThreadInCourse} = useStoreActions((actions) => actions.courseStore)
  const {fetchCourseDetails} = useStoreActions((actions) => actions.courseStore)
  console.log(id)
  console.log(error)
  console.log(loading)
  useEffect(() => {

  })
  const handleSubmit = async(e) => {
    e.preventDefault();
    const newThread = {title: title}
    try{
        await createThread({threadData: newThread, id: id, courseStoreActions: {addThreadInCourse}})
        fetchCourseDetails(id);
        navigate(`/courses/${id}`)
    }catch(error){
        console.error("Error creating the thread:",error)
    }
    
  }
  return (
    <div className="NewThread">
      <h2>New Thread</h2>
      <form className="newPostForm" onSubmit={handleSubmit}>
        <label htmlFor="threadTitle" style={{position: "relative", right: "40px"}}>Thread title: </label>
        <input
              style={{paddingRight: "20px", textAlign: "center"}}
              id="threadTitle"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
          />
        <br/>
          
      <br/>
      <button type="submit" style={{marginTop: "10px", position: "relative", left: "95px", padding: "10px", borderRadius: "10px", color: "black", backgroundColor: "#FFFFFF"}} disabled={loading}>
          {loading ? 'Creating...' : 'Create Thread'}
        </button>
      </form>
      </div>
  )
}

export default NewThread