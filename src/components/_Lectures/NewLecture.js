import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { useParams,Link } from 'react-router-dom';
import { useState } from 'react';
const NewLecture = () => {
    const {courseID} = useParams() 
    const getCoursesByID = useStoreState((state) => state.courseStore.getCoursesById);
    const createLecture = useStoreActions((actions) => actions.lectureStore.createLecture)
    const  {addLectureInCourse} = useStoreActions((actions) => actions.courseStore)
    const fetchCourseDetails = useStoreActions((actions) => actions.courseStore.fetchCourseDetails)
    const course = getCoursesByID(courseID)
    const [description, setDescription] = useState('')
    const [name, setName] = useState('')
    const [file,setFile] = useState(null)
    const navigate = useNavigate()
    const handleSubmit = async(e) => {
        e.preventDefault();
        const newLecture = {file: file, name: name, description: description}
        try{
            await createLecture({LectureData: newLecture,id:courseID, courseStoreActions : { addLectureInCourse}})
            fetchCourseDetails(courseID);
            navigate(`/courses/${courseID}`)
        }catch(error){
            console.error("Error creating the lecture:",error)
        }
    }
    return(
        <div className = "NewLecture">
            <h2>New Lecture</h2>
            <form className="newPostForm" style={{display: "flex", flexDirection:"column"}} onSubmit={handleSubmit}>
                <div style={{marginTop: "23px", paddingBottom: "15px"}}>
                <label htmlFor="postName" style={{position: "relative", left: "45px",fontWeight: "bolder"}}>Lecture Name: </label>
                <input
                    style={{position: "relative",padding: "10px", marginLeft: "55px",paddingRight: "260px",left: "70px"}}
                    id="postName"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                </div>
                <div style={{marginTop: "15px", paddingBottom: "15px"}}>
                <label htmlFor="postDescription" style={{position: "relative", left: "15px",bottom: "95px",fontWeight: "bolder"}}>Lecture Description:</label>
                <textarea
                    style={{position: "relative",padding: "10px", marginLeft: "15px",paddingRight: "100px",left: "40px"}}
                    rows="10" 
                    cols="40"
                    id="postDescription"
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                </div>
                <div style={{marginTop: "15px", paddingBottom: "15px"}}>
                <label htmlFor="postFile" style={{position: "relative", left: "35px",fontWeight: "bolder"}}>Lecture File:</label>
                <input 
                    style={{position: "relative",padding: "40px",marginLeft: "15px",paddingRight: "150px", left: "160px"}}
                    id="postFile"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    />
                </div>
                <button type="submit" className="submitBtn" style={{marginLeft: "150px", fontSize: "18px" }}>Submit</button>
            </form>
        </div>
    )
}
export default NewLecture