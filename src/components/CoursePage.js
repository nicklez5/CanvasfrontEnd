import { useParams, Link, useLocation} from "react-router-dom"
import { useNavigate} from "react-router-dom"
import { useStoreState, useStoreActions} from "easy-peasy"
import { Table } from "react-bootstrap"
import { useEffect,useState, useContext } from "react"
import useAxiosFetch from '../hooks/useAxiosFetch';
import {parseISO } from "date-fns"
import { fr   } from 'date-fns/locale/fr';
import { format,formatInTimeZone } from 'date-fns-tz';

const CoursePage = () => {
  const {id} = useParams()
  const location = useLocation()
  const {course} = location.state || {}
  const navigate = useNavigate();
  const getCoursesById = useStoreState((state) => state.coursesStore.getCoursesById)
  const courseFromStore = getCoursesById(id)
  const courseToUse = course || courseFromStore
  const deleteStudent = useStoreActions((actions) => actions.deleteStudent)
  const deleteCourse = useStoreActions((actions) => actions.deleteCourse);
  const deleteMessage = useStoreActions((actions) => actions.deleteMessage);
  const deleteAssignment = useStoreActions((actions) => actions.deleteAssignment)
  const deleteLecture = useStoreActions((actions) => actions.deleteLecture)
  const deleteTest = useStoreActions((actions) => actions.deleteTest)
  const deleteThreads = useStoreActions((actions) => actions.deleteThreads)
  const saveAssignment = useStoreActions((actions) => actions.saveAssignment)
  const addCourse = useStoreActions((actions) => actions.canvasStore.addCourse)
  const removeCourse = useStoreActions((actions) => actions.removeCourse)
  const curseAssignments = useStoreState((state) => state.courseAssignments)
  const getAssignmentsById = useStoreState((state) => state.getAssignmentsById)
  const editAssignment = useStoreActions((action) => action.editAssignment)
  const setAssignments = useStoreActions((action) => action.getAssignments)
  const assignments = useStoreState((state) => state.assignments)
  const canvasCourses = useStoreState((state) => state.canvasStore.list_courses)
  const addCanvasCourses = useStoreActions((actions) => actions.canvasStore.addCanvas)
  
//   useEffect(()=> {
//     console.log(id)
//     console.log(JSON.stringify(window.localStorage.getItem('course')))
//     const serializedState = JSON.parse(window.localStorage.getItem('course'))
//     console.log(JSON.stringify(serializedState))
//     const courses123 = serializedState.filter(obj => (obj.id).toString() === id)
//     console.log(JSON.stringify(courses123[0]))
//     //console.log(JSON.stringify(courseState[0]))
//     if(serializedState){
//         setCourse(courses123[0])
//     }
//   },[setCourse,id])
  let doIhaveIt = canvasCourses.some((course) => course.id === id)
  const handleDeleteStudent = async({emailID,firstName,lastName,dob, courseID}) => {
    deleteStudent([emailID,firstName,lastName,dob, courseID])
    navigate('/home')
  }
  const handleDeleteThread = async([threadID,courseID]) => {
    deleteMessage([threadID,courseID])
    navigate('/home')
  }
  const handleDeleteLecture = async([lectureID,courseID]) => {
    deleteLecture([lectureID,courseID])
    navigate(`/home`)
  }
  const handleDeleteAssignment = async([assignmentID,courseID]) => {
   
    deleteAssignment([assignmentID,courseID])
    navigate(`/home`)
  }
  const handleDeleteTest = async([testID, courseID]) => {
    deleteTest([testID,courseID])
    navigate('/home')
  }
  const handleAddAssignment = async([assignmentID, courseID]) => {
    saveAssignment([courseID, assignmentID])
    navigate('/home')
  }
  const handleAddCourse = async(courseID) => {
    const course123 = getCoursesById(courseID)
    addCanvasCourses(course123)

  }
  const handleRemoveCourse = async(courseID) => {
    removeCourse(courseID)
  }
 
  const date2 = (date) => {
    return formatInTimeZone(date, 'UTC', 'MM/dd/yyyy hh:mm a')
  }
  const courseThreadsMessages = courseToUse.threads.map(message1 => {
            
        return message1.list_messages.map(message => (
                
                <tr key={message.id}>
                <td>{message1.id}</td>
                <td>{message.id}</td>
                <td>{message.description}</td>
                <td>{message.author}</td>
                <td>{date2(message.timestamp)}</td>
                <td><Link to={`/editMessage/${message.id}`}><button className="editButton">Edit Message</button></Link><button className="deleteButton" onClick={() => handleDeleteThread([message.id,message1.id ])}>Delete Message</button></td>
                </tr>
                
        ))
          
    })
    
  
  const courseTests = courseToUse.tests.map((test) => {
    return (
        <tr className="tests">
        <td>{test.id}</td>
        <td>{test.description}</td>
        <td>{test.submitter}</td>
        <td>{test.student_points}</td>
        <td>{test.max_points}</td>
        <td><a href={`http://localhost:8000${test.file}`} target="_blank">{test.file}</a></td>
        <td><Link to={`/editTest/${test.id}`}><button className="editButton">Edit Test</button></Link><button className="deleteButton" onClick={() => handleDeleteTest([test.id,id])}>Delete Test</button></td>
        </tr>
    )
  })
  const courseLectures = courseToUse.lectures.map((lecture) => {
     return (
     <tr className="lectures">
        <td>{lecture.id}</td>
        <td>{lecture.description}</td>
        <td>{lecture.name}</td>
        <td><a href={`http://localhost:8000${lecture.file}`} target="_blank">{lecture.file}</a></td>
        <td><Link to={`/editCourse/${lecture.id}`}><button className="editButton">Edit Lecture</button></Link><button className="deleteButton" onClick={() => handleDeleteLecture([lecture.id,id])}>Delete Lecture</button></td>
    </tr>
    )
  })
  const courseAssignments = courseToUse.assignments.map((assignment) => {
    return(
        <tr className="lectures">
            <td>{assignment.id}</td>
            <td>{assignment.name}</td>
            <td>{assignment.submitter}</td>
            <td>{assignment.description}</td>
            <td>{date2(assignment.date_due)}</td>
            <td><a href={`http://localhost:8000${assignment.file}`} target="_blank">{assignment.file}</a></td>
            <td><Link to={`/editCourse/${id}/Assignment/${assignment.id}`}><button className="editButton">Edit Assignment</button></Link><button className="deleteButton" onClick={() => handleDeleteAssignment([assignment.id,id])}>Delete Assignment</button></td>
            
            
        </tr>
    )
  })
  const courseProfiles = courseToUse.profiles.map((profile) => {
    return (
        <tr className="profiles">
            <td>{profile.pk}</td>
            <td>{profile.email}</td>
            <td>{profile.first_name}</td>
            <td> {profile.last_name}</td>
            <td>{profile.date_of_birth}</td>
            <td><Link to={`/update/${profile.pk}/`}><button className="editButton">Edit Profile</button></Link><button className="deleteButton" onClick={() => handleDeleteStudent({emailID: profile.email, firstName: profile.first_name, lastName: profile.last_name,dob: profile.date_of_birth, courseID: id})}>Remove Student</button></td>
        </tr>
    )
  })
  return (
    <main className="CoursePage">
        <article className="course">
            { courseToUse && 
            <>  

                <h2 style={{display: "flex" ,alignItems: "center", justifyContent: "center"}}>{courseToUse.name}'s Lectures </h2>
                { doIhaveIt === false ? <button className="addClass" onClick={() => handleAddCourse(courseToUse.id)}>Add Class</button> : <button className="removeClass" onClick={() => handleRemoveCourse(courseToUse.id)}>Remove Class</button>}
                <Table hover>
                    <thead>
                        <tr>
                            <th>Lecture ID</th>
                            <th>Description</th>
                            <th>Lecture Name</th>
                            <th>Lecture File</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>{courseLectures}</tbody>
                </Table>
            </>}
        </article>
        <article className="assignments">
            { courseToUse && 
            <>
            <h2 style={{display: "flex" ,alignItems: "center", justifyContent: "center"}}>Assignments</h2>
            <Link to={`/addAssignment/${id}`} ><button className="addButton" >Add Assignment</button></Link>
                <Table hover>
                    <thead>
                        <tr>
                            <th>Assignment ID</th>
                            <th>Assignment Name</th>
                            <th>Submitter</th>
                            <th>Description</th>
                            <th>Date Due</th>
                            <th>File</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>{courseAssignments}</tbody>
                </Table>
            </>
            }
        </article>
        <article className="tests">
            { courseToUse && 
            <>
            <h2 style={{display: "flex" ,alignItems: "center", justifyContent: "center"}}>Tests</h2>
            <Link to={`/addTest/${id}`} ><button className="addButton" >Add Test</button></Link>
                <Table hover>
                    <thead>
                        <tr>
                            <th>Test ID</th>
                            <th>Description</th>
                            <th>Submitter</th>
                            <th>Student Points</th>
                            <th>Max Points</th>
                            <th>File</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>{courseTests}</tbody>
                </Table>
            </>
            }
        </article>
        <article className="messages">
            { courseToUse && 
            <>
            <h2 style={{display: "flex" ,alignItems: "center", justifyContent: "center"}}>Threads</h2>
            <Link to={`/addMessage/${id}`} ><button className="addButton" >Add Message</button></Link>
                <Table hover>
                    <thead>
                        <tr>
                            <th>Thread ID</th>
                            <th>Message ID</th>
                            <th>Description</th>
                            <th>Author</th>
                            <th>Timestamp</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>{courseThreadsMessages}</tbody>
                    
                </Table>
            </>
            }
        </article>
        <article className="profiles">
            { courseToUse && 
            <>
            <h2 style={{display: "flex" ,alignItems: "center", justifyContent: "center"}}>Students</h2>
            <Link to={`/addStudent/${id}`} ><button className="addButton" >Add Student</button></Link>
                <Table hover>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Date of Birth</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>{courseProfiles}</tbody>
                    
                </Table>
            </>
            }
        </article>
    </main>
  )
}

export default CoursePage