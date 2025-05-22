import { useEffect,useState} from 'react';
import { useParams,Link } from 'react-router-dom';
import { useStoreState, useStoreActions, useStore } from 'easy-peasy'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import useAxiosFetch from '../hooks/useAxiosFetch';
import moment from 'moment';
import axios from 'axios'
import { format,formatInTimeZone } from 'date-fns-tz';
const EditAssignment = () => {
  const {id,id2} = useParams();
  const navigate = useNavigate();
  const courses = useStoreState((state ) => state.courses)
  const setCourses = useStoreActions((action) => action.setCourses)
  const setAssignments = useStoreActions((action) => action.setAssignments)
  const assignmentName = useStoreState((state) => state.assignmentName)
  const assignmentDate = useStoreState((state) => state.assignmentDate)
  const assignmentDescription = useStoreState((state) => state.assignmentDescription)
  const assignmentMaxPoints = useStoreState((state) => state.assignmentMaxPoints)
  const assignmentStudentPoints = useStoreState((state) => state.assignmentStudentPoints)
  const assignmentSubmitter = useStoreState((state) => state.assignmentSubmitter)
  const assignmentFile = useStoreState((state) => state.assignmentFile)
  const setAssignmentName = useStoreActions((actions) => actions.setAssignmentName)
  const setAssignmentDate = useStoreActions((actions) => actions.setAssignmentDate)
  const setAssignmentDescription = useStoreActions((actions) => actions.setAssignmentDescription)
  const setAssignmentMaxPoints = useStoreActions((actions) => actions.setAssignmentMaxPoints)
  const setAssignmentStudentPoints = useStoreActions((actions) => actions.setAssignmentStudentPoints)
  const setAssignmentSubmitter = useStoreActions((actions) => actions.setAssignmentSubmitter)
  const setAssignmentFile = useStoreActions((actions) => actions.setAssignmentFile)
  const getCoursesById = useStoreState((state) => state.getCoursesById)
  const getAssignmentsById = useStoreState((state) => state.getAssignmentsById)
  const editAssignment = useStoreActions((actions) => actions.editAssignment)
  const assignment = getAssignmentsById(id,id2)
  
  useEffect(() => {
    if(assignment){
        console.log(assignment)
        setAssignmentName(assignment.name)
        setAssignmentDate(assignment.date_due)
        setAssignmentDescription(assignment.description)
        setAssignmentMaxPoints(assignment.max_points)
        setAssignmentStudentPoints(assignment.student_points)
        setAssignmentSubmitter(assignment.submitter)
        setAssignmentFile(assignment.file)
    }
  },[assignment, setAssignmentName, setAssignmentDate,setAssignmentDescription,setAssignmentFile,setAssignmentMaxPoints,setAssignmentStudentPoints,setAssignmentSubmitter])
  const handleEdit =  async(semi_id) => {
    const formatDate = (date) => {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2,'0')
        const day =  String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`
    }
    const datetime = formatDate(new Date(assignmentDate))
    const updatedAssignment = { id: semi_id, name: assignmentName, date_due: datetime, description: assignmentDescription, max_points: assignmentMaxPoints, student_points: assignmentStudentPoints, submitter: assignmentSubmitter , file: assignmentFile }
    editAssignment([updatedAssignment,id])
    navigate(`/courses/${id}`)
}
  
  return (
    <main className="EditCourse">
        {assignmentName && 
            <>
                <h2>Assignment ID: ${assignment.id}</h2>
                <form className="newAssignmentForm" onSubmit={(e) => e.preventDefault}>
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
                <button type="button" style={{marginRight: "10px" }} onClick={() => handleEdit(assignment.id)}>Submit</button>
                </form>
            </>
        }
    </main>
  )
}

export default EditAssignment