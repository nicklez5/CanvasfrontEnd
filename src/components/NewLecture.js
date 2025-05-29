import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { useParams,Link } from 'react-router-dom';
import { useState } from 'react';
const NewLecture = () => {
    const {courseID} = useParams() 
    const getCoursesByID = useStoreState((state) => state.courseStore.getCoursesById);
    const createLecture = useStoreActions((actions) => actions.lectureStore.createLecture)
    const  courseStoreActions = useStoreActions((actions) => actions.courseStore)
    const course = getCoursesByID(courseID)
    const [description, setDescription] = useState('')
    const [name, setName] = useState('')
    const [file,setFile] = useState(null)
    const navigate = useNavigate()
    const handleSubmit = async(e) => {
        e.preventDefault();
        const newLecture = {file: file, name: name, description: description}
        createLecture({LectureData: newLecture,id:courseID, courseStoreActions})
        navigate(`/courses/${courseID}`)
    }
    return(
        <main className = "NewLecture">
            <h2>New Lecture</h2>
            <form className="newPostForm" onSubmit={handleSubmit}>
                <label htmlFor="postName">Lecture Name: </label>
                <br/>
                <input
                    id="postName"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <br/>
                <label htmlFor="postDescription">Lecture Description:</label>
                <br/>
                <textarea
                    
                    rows="4" 
                    cols="50"
                    id="postDescription"
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <br/>
                <label htmlFor="postFile">Lecture File</label>
                <br/>
                <input 
                    id="postFile"
                    type="file"
                    onChange={(e) => setFile(e.target.files[0])}
                    />
                <br/>
                <button type="submit" style={{marginLeft: "150px" }}>Submit</button>
            </form>
        </main>
    )
}
export default NewLecture