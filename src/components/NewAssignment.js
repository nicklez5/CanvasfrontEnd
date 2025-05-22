import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { useParams,Link } from 'react-router-dom';

const NewAssignment = () => {
    const {courseID} = useParams() 
    const getCoursesByID = useStoreState((state) => state.getCoursesById);
    const course = getCoursesByID(courseID)
    const assignmentName = useStoreState((state) => state.assignmentName)
    const assignmentDate = useStoreState((state) => state.assignmentDate) 
    const assignmentDescription = useStoreState((state) => state.assignmentDescription)
    const assignmentMaxPoints = useStoreState((state) => state.assignmentMaxPoints)
    const assignmentStudentPoints = useStoreState((state) => state.assignmentStudentPoints)
    const assignmentSubmitter = useStoreState((state) => state.assignmentSubmitter)
    const assignmentFile = useStoreState((state) => state.assignmentFile)
    const saveAssignment = useStoreActions((state) => state.saveAssignment)
    const setAssignmentName = useStoreActions((actions) => actions.setAssignmentName)
    const setAssignmentDate = useStoreActions((actions) => actions.setAssignmentDate)
    const setAssignmentDescription = useStoreActions((actions) => actions.setAssignmentDescription)
    const setAssignmentMaxPoints = useStoreActions((actions) => actions.setAssignmentMaxPoints)
    const setAssignmentStudentPoints = useStoreActions((actions) => actions.setAssignmentStudentPoints)
    const setAssignmentSubmitter = useStoreActions((actions) => actions.setAssignmentSubmitter)
    const setAssignmentFile = useStoreActions((actions) => actions.setAssignmentFile)
    const navigate = useNavigate()
    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log(course.assignments)
        const id = course.assignments.length ? course.assignments[course.assignments.length - 1].id + 1 : 1;
        const formatDate = (date) => {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2,'0')
            const day =  String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}`
        }
        const datetime = formatDate(new Date(assignmentDate))
        const newAssignment = {id: id, name: assignmentName, date_due: datetime , description: assignmentDescription, max_points: assignmentMaxPoints, student_points: assignmentStudentPoints, submitter: assignmentSubmitter , file: assignmentFile}
        saveAssignment([newAssignment,courseID])
        navigate('/home')
    }
    return(
        <main className = "NewAssignment">
            <h2>New Assignment</h2>
            <form className="newPostForm" onSubmit={handleSubmit}>
                <label htmlFor="postName">Assignment Name:</label>
                <br/>
                <input
                    id="postName"
                    type="text"
                    required
                    value={assignmentName}
                    onChange={(e) => setAssignmentName(e.target.value)}
                />
                <br/>
                <label htmlFor="postDate">Assignment Due Date:</label>
                <br/>
                <input 
                    id="postDate"
                    type="datetime-local"
                    required
                    value={assignmentDate}
                    
                    onChange={(e) => setAssignmentDate(e.target.value)}
                />
                <br/>
                <label htmlFor="postDescription">Assignment Description:</label>
                <br/>
                <textarea
                    rows="4" 
                    cols="50"
                    id="postDescription"
                    type="text"
                    required
                    value={assignmentDescription}
                    onChange={(e) => setAssignmentDescription(e.target.value)}
                />
                <br/>
                <label htmlFor="postSubmitter">Assignment Submitter</label>
                <br/>
                <input 
                    id="postSubmitter"
                    type="text"
                    required
                    value={assignmentSubmitter}
                    onChange={(e) => setAssignmentSubmitter(e.target.value)}
                />
                <br/>
                <label htmlFor="postMaxPoints">Assignment Max Points</label>
                <br/>
                <input 
                    id="postMaxPoints"
                    type="number"
                    required
                    value={assignmentMaxPoints}
                    onChange={(e) => setAssignmentMaxPoints(e.target.value)}
                    />
                <br/>
                <label htmlFor="postMaxStudentPoints">Assignment Student Points</label>
                <br/>
                <input 
                    id="postStudentMaxPoints"
                    type="number"
                    required
                    value={assignmentStudentPoints}
                    onChange={(e) => setAssignmentStudentPoints(e.target.value)}
                    />
                <br/>
                <label htmlFor="postFile">Assignment File</label>
                <br/>
                <input 
                    id="postFile"
                    type="file"
                    multiple
                    onChange={(e) => setAssignmentFile(e.target.files[0])}
                    />
                <br/>
                <button type="submit" style={{marginRight: "10px" }}>Submit</button>
            </form>
        </main>
    )
}
export default NewAssignment