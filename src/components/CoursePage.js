import { useParams, Link, useLocation} from "react-router-dom"
import { useNavigate} from "react-router-dom"
import { useStoreState, useStoreActions} from "easy-peasy"
import { Table } from "react-bootstrap"
import { useEffect,useState, useContext } from "react"
import useAxiosFetch from '../hooks/useAxiosFetch';
import {parseISO } from "date-fns"
import { fr   } from 'date-fns/locale/fr';
import { format,formatInTimeZone } from 'date-fns-tz';
import axios from "axios"
import api from "../api/courses"
import fileDownload from 'react-file-download';
const CoursePage = () => {
  const {id} = useParams()
  const location = useLocation()
  //const {course} = location.state || {}
  const navigate = useNavigate();
  const {user} = useStoreState((state) => state.userStore)
  const getCourseById = useStoreState((state) => state.userStore.getCourseById)
  const deleteLecture = useStoreActions((actions) => actions.lectureStore.deleteLecture)
  const deleteAssignment = useStoreActions((actions) => actions.assignmentStore.deleteAssignment)
  const courseStoreActions = useStoreActions(actions => actions.courseStore);
  const fetchCourseDetails = useStoreActions((actions) => actions.courseStore.fetchCourseDetails);
  const getCoursesById = useStoreState((state) => state.courseStore.getCoursesById)
  const removeCourseFromCanvasThunk = useStoreActions((actions) => actions.userStore.removeCourseFromCanvasThunk)
  const course = useStoreState((state) => state.courseStore.courses[0]);
  const removeStudentFromCourse = useStoreActions((actions) => actions.courseStore.removeStudentFromCourse); 
  const removeCourseFromCanvas = useStoreActions((actions) => actions.userStore.removeCourseFromCanvas); // Remove course from canvas
  //const fetchCourseDetails = useStoreActions((actions) => actions.courseStore.fetchCourseDetails);
  const deleteStudent = useStoreActions((actions) => actions.deleteStudent)
  const deleteCourse = useStoreActions((actions) => actions.deleteCourse);
  const deleteMessage = useStoreActions((actions) => actions.deleteMessage);
  const deleteTest = useStoreActions((actions) => actions.deleteTest)
  const deleteThreads = useStoreActions((actions) => actions.deleteThreads)
  const saveAssignment = useStoreActions((actions) => actions.saveAssignment)
  const removeCourse = useStoreActions((actions) => actions.removeCourse)
  const curseAssignments = useStoreState((state) => state.courseAssignments)
  const getAssignmentsById = useStoreState((state) => state.getAssignmentsById)
  const editAssignment = useStoreActions((action) => action.editAssignment)
  const setAssignments = useStoreActions((action) => action.getAssignments)
  const assignments = useStoreState((state) => state.assignments)
  const canvas = useStoreState((state) => state.userStore.canvas.list_courses)
  const addCourseToCanvasThunk = useStoreActions((actions) => actions.userStore.addCourseToCanvasThunk)
  useEffect(() => {
    // Fetch course details when the component mounts or courseID changes
    fetchCourseDetails(id);
  }, [id, fetchCourseDetails]);
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
  //console.log(id)
  //console.log(canvas)
  const doIhaveIt = getCourseById(id)
  //console.log(doIhaveIt)
  const handleDeleteStudent = async(studentId) => {
    try {
      // Send API request to remove the student from the course
      const response = await api.post(`/courses/${id}/remove_student/${studentId}/`);

      // After successful removal, update the local store
      removeStudentFromCourse({ id, studentId });
      removeCourseFromCanvas(id); // Remove the course from the student's canvas if necessary

      // Optionally, navigate back to the course list or another page
      fetchCourseDetails(id)
    } catch (error) {
      console.error("Failed to remove student from course", error);
    }
  
  }
  const handleDeleteThread = async([threadID,courseID]) => {
    deleteMessage([threadID,courseID])
    navigate('/home')
  }
  const handleDeleteLecture = async(lectureId) => {
    const success = await deleteLecture({id: course.id,lectureID: lectureId ,courseStoreActions:courseStoreActions})
    if(success){
      alert("Lecture deleted succesfully")
    }else{
      alert("Failed to delete lecture.");
    }
  }
  const handleDeleteAssignment = async(assignmentId) => {
    const success = await deleteAssignment({id: course.id, assignmentID: assignmentId, courseStoreActions: courseStoreActions})
    if(success){
      alert("Assignment deleted succesfully")
      fetchCourseDetails(id)
    }else{
      alert("Failed to delete Assignment.");
    }
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
    addCourseToCanvasThunk(course123)
    fetchCourseDetails(courseID)
    
  }
  
  const handleRemoveCourse = async(courseID) => {
    removeCourseFromCanvasThunk(courseID)
    fetchCourseDetails(courseID)
  }
  const handleDownload = (lecture) => {
    api.get(lecture.file, { responseType: 'blob' })
      .then((response) => {
        fileDownload(response.data, `${lecture.name}.pdf`);
      })
      .catch((error) => {
        console.error('Error downloading file:', error);
      });
  };
  const date2 = (date) => {
    return formatInTimeZone(date, 'UTC', 'MM/dd/yyyy hh:mm a')
  }
  const courseThreadsMessages = course.threads.map((message1) => {
    // Check if `message1.list_messages` exists and is not empty
    return message1.list_messages && message1.list_messages.length > 0 ? (
        message1.list_messages.map((message) => (
            <tr key={message.id}>
                <td>{message1.id}</td>
                <td>{message.id}</td>
                <td>{message.body}</td>
                <td>{message.author}</td>
                <td>{date2(message.timestamp)}</td>
                <td>
                    <Link to={`/editMessage/${message.id}`}>
                        <button className="editButton">Edit Message</button>
                    </Link>
                    <button className="deleteButton" onClick={() => handleDeleteThread([message.id, message1.id])}>Delete Message</button>
                </td>
            </tr>
        ))
    ) : (
        <tr key="no-messages">
            <td >{message1.id}</td>
            <td >{message1.title}</td>
            <td >{date2(message1.created_at)}</td>
              {/* Provide a message indicating no messages */}
        </tr>
    );
  });

    
  
  const courseTests = course.tests.map((test) => {
    return (
        <tr className="tests">
        <td>{test.id}</td>
        <td>{test.name}</td>
        <td>{test.submitter}</td>
        <td>{test.description}</td>
        <td>{test.max_points}</td>
        <td>{test.student_points}</td>
        <td>{date2(test.date_due)}</td>   
        <td><a href={`http://localhost:8000${test.file}`} target="_blank">{test.file}</a></td>
        <td>{ user.is_staff ? ( <><Link to={`/editTest/${test.id}`}><button className="editButton">Edit Test</button></Link><button className="deleteButton" onClick={() => handleDeleteTest([test.id,id])}>Delete Test</button> </> ) : <td><><Link to={`/submitCourse/${id}/Test/${test.id}`}><button className="editButton">Submit Test</button></Link></></td> }</td>
        </tr>
    )
  })
  const courseLectures = course.lectures.map((lecture) => {
     return (
     <tr className="lectures">
        <td>{lecture.id}</td>
        <td>{lecture.description}</td>
        <td>{lecture.name}</td>
        <td><a href={`http://localhost:8000${lecture.file}`} target="_blank">{lecture.file}</a></td>
        { user.is_staff ? ( <td><Link to={`/editCourse/${lecture.id}`}><button className="editButton">Edit Lecture</button></Link><button className="deleteButton" onClick={() => handleDeleteLecture(lecture.id)}>Delete Lecture</button></td>): null}
    </tr>
    )
  })
  const courseAssignments = course.assignments.map((assignment) => {
    return(
        <tr className="assignments">
            <td>{assignment.id}</td>
            <td>{assignment.name}</td>
            <td>{assignment.submitter}</td>
            <td>{assignment.description}</td>
            <td>{assignment.max_points}</td>
            <td>{assignment.student_points}</td>
            <td>{date2(assignment.date_due)}</td>
            <td><a href={`http://localhost:8000${assignment.assignment_file}`} target="_blank">{assignment.assignment_file}</a></td>

            <td>{ user.is_staff ? ( <><Link to={`/editCourse/${id}/Assignment/${assignment.id}`}><button className="editButton">Edit Assignment</button></Link><button className="deleteButton" onClick={() => handleDeleteAssignment([assignment.id])}>Delete Assignment</button> </> ) : <td><><Link to={`/submitCourse/${id}/Assignment/${assignment.id}`}><button className="editButton">Submit Assignment</button></Link></></td> }</td>
            
            
        </tr>
    )
  })
  const courseProfiles = course.profiles.map((profile) => {
    return (
        <tr className="profiles">
            <td>{profile.id}</td>
            <td>{profile.email}</td>
            <td>{profile.first_name}</td>
            <td> {profile.last_name}</td>
            <td>{profile.date_of_birth}</td>
            <td>{ user.is_staff ? ( <><Link to={`/update/${profile.id}/`}><button className="editButton">Edit Profile</button></Link><button className="deleteButton" onClick={() => handleDeleteStudent(profile.id)}>Remove Student</button></>): null}</td>
        </tr>
    )
  })
  return (
    <main className="CoursePage">
        <article className="course">
            { course && 
            <>  

                <h2 style={{display: "flex" ,alignItems: "center", justifyContent: "center"}}>{course.name}'s Lectures </h2>
                { doIhaveIt === undefined ? <button className="addClass" onClick={() => handleAddCourse(course.id)}>Add Class</button> : <button className="removeClass" onClick={() => handleRemoveCourse(course.id)}>Remove Class</button>}
                {user.is_staff ? ( <><Link to={`/addLecture/${id}`} ><button className="addButton" >Add Lecture</button></Link> </>) : null}
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
            { course && 
            <>
            <h2 style={{display: "flex" ,alignItems: "center", justifyContent: "center"}}>Assignments</h2>
            {user.is_staff ? ( <><Link to={`/addAssignment/${id}`} ><button className="addButton" >Add Assignment</button></Link> </>): null}
                <Table hover>
                    <thead>
                        <tr>
                            <th>Assignment ID</th>
                            <th>Assignment Name</th>
                            <th>Submitter</th>
                            <th>Description</th>
                            <th>Max Points</th>
                            <th>Student Points</th>
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
            { course && 
            <>
            <h2 style={{display: "flex" ,alignItems: "center", justifyContent: "center"}}>Tests</h2>
            {user.is_staff ? ( <><Link to={`/addTest/${id}`} ><button className="addButton" >Add Test</button></Link> </> ) : null}
                <Table hover>
                    <thead>
                        <tr>
                            <th>Test ID</th>
                            <th>Test Name</th>
                            <th>Submitter</th>
                            <th>Description</th>
                            <th>Max Points</th>
                            <th>Student Points</th>
                            <th>Date Due</th>
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
            { course && 
            <>
            <h2 style={{display: "flex" ,alignItems: "center", justifyContent: "center"}}>Threads</h2>
            { course.threads.length === 0 ? ( <><Link to={`/addThread/${id}`} ><button className="addButton" >Create Thread</button></Link> </> ) : <Link to={`/addMessage/${id}`} ><button className="addButton" >Add Message</button></Link>}
                <Table hover>
                    <thead>
                        <tr>
                            <th>Thread ID</th>
                            <th>Thread Title</th>
                            <th>Thread Created At</th>
                            <th>Message ID</th>
                            <th>Message Body</th>
                            <th>Message Author</th>
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
            { course && 
            <>
            <h2 style={{display: "flex" ,alignItems: "center", justifyContent: "center"}}>Students</h2>
             {user.is_staff ? ( <><Link to={`/addStudent/${id}`} ><button className="addButton" >Add Student</button></Link></> ) : null}
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