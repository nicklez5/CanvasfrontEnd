import { useParams, Link, useLocation} from "react-router-dom"
import { useNavigate} from "react-router-dom"
import { useStoreState, useStoreActions ,useStoreRehydrated} from "easy-peasy"
import { Table, Button, Spinner } from "react-bootstrap"
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
  const thread_id = useStoreState((state) => state.threadStore.thread.id) 
  //console.log(thread_id)
  const getCourseById = useStoreState((state) => state.userStore.getCourseById)
  const deleteMessage = useStoreActions((actions) => actions.messageStore.deleteMessage)
  const deleteLecture = useStoreActions((actions) => actions.lectureStore.deleteLecture)
  const deleteAssignment = useStoreActions((actions) => actions.assignmentStore.deleteAssignment)
  const {fetchCourses, removeTestFromCourse, removeAssignmentFromCourse, removeLectureFromCourse,removeThreadFromCourse, removeMessageFromThread, deleteCourse} = useStoreActions((actions) => actions.courseStore);
  const deleteThread = useStoreActions((actions) => actions.threadStore.deleteThread)
  const fetchCourseDetails = useStoreActions((actions) => actions.courseStore.fetchCourseDetails);
  const getCoursesById = useStoreState((state) => state.courseStore.getCoursesById)
  const removeCourseFromCanvasThunk = useStoreActions((actions) => actions.userStore.removeCourseFromCanvasThunk)
  const course = useStoreState((state) => state.courseStore.getCoursesById(id))
  const removeStudentFromCourse = useStoreActions((actions) => actions.courseStore.removeStudentFromCourse); 
  const removeCourseFromCanvas = useStoreActions((actions) => actions.userStore.removeCourseFromCanvas); // Remove course from canvas
  //const fetchCourseDetails = useStoreActions((actions) => actions.courseStore.fetchCourseDetails);
  const deleteTest = useStoreActions((actions) => actions.testStore.deleteTest)
  const saveAssignment = useStoreActions((actions) => actions.saveAssignment)
  const studentId = useStoreState((s) => s.userStore.user.pk)
  const studentAssignmentGrades = useStoreState((s) => s.submissionStore.studentAssignmentGrades)
  const studentTestGrades = useStoreState((s) => s.submissionStore.studentTestGrades) || [];
  const fetchStudentTestGrades = useStoreActions((a) => a.submissionStore.fetchStudentTestGrades)
  const fetchStudentAssignmentGrades = useStoreActions((a) => a.submissionStore.fetchStudentAssignmentGrades)
  const doIhaveIt = getCourseById(id)
  const addCourseToCanvasThunk = useStoreActions((actions) => actions.userStore.addCourseToCanvasThunk)
  const message_error = useStoreState((state) => state.messageStore.error)
  useEffect(() => {
    // Fetch course details when the component mounts or courseID changes
    fetchCourses()
  }, [fetchCourses]);

  useEffect(() => {
    if(studentId && id){
      const courseId = parseInt(id,10)
      fetchStudentTestGrades({courseId, studentId})
      fetchStudentAssignmentGrades({courseId, studentId})
    }
  },[id,studentId, fetchStudentTestGrades,fetchStudentAssignmentGrades])
  const renderTestStatus = (test) => {
    const sub = studentTestGrades.find((s) => s.test === test.id);
    const courseid = parseInt(id, 10)
    if (!sub) {
      // No submission yet
      return (
        <Link to={`/submitTest/${courseid}/${test.id}`}>
          <Button size="sm">Submit Test</Button>
        </Link>
      );
    }

    if (sub.student_points == null) {
      // Submitted but not graded
      return <span>Submitted</span>;
    }

    // Graded: show score (or percentage)
    const pct = ((sub.student_points / test.max_points) * 100).toFixed(1);
    return (
      <>
        <span>{sub.student_points} / {test.max_points}</span>
        <br />
        <small>({pct}%)</small>
      </>
    );
  }
   const renderAssignmentStatus = (assignment) => {
    // assignment.id is a Number; rawId from URL (if used) would be a String
    // But here assignment.id is already numeric, so we match to `sub.assignment`
    const sub = studentAssignmentGrades.find(
      (s) => s.assignment === assignment.id
    );
    if (!sub) {
      // No submission exists yet
      return (
        <Link to={`/submitAssignment/${id}/${assignment.id}`}>
          <Button size="sm">Submit Assignment</Button>
        </Link>
      );
    }

    // If submission exists but not graded
    if (sub.student_points == null) {
      return <span>Submitted</span>;
    }

    // If graded
    const pct = ((sub.student_points / assignment.max_points) * 100).toFixed(1);
    return (
      <>
        {sub.student_points} / {assignment.max_points} <br />
        <small>({pct}%)</small>
      </>
    );
  };
  //console.log(doIhaveIt) 
  const handleDeleteStudent = async(studentId) => {
    try {
      // Send API request to remove the student from the course
      await api.post(`/courses/${id}/remove_student/${studentId}/`);
      removeStudentFromCourse({ id, studentId });
      removeCourseFromCanvas(id)
      // After successful removal, update the local store // Remove the course from the student's canvas if necessary

      // Optionally, navigate back to the course list or another page
      fetchCourseDetails(id)
    } catch (error) {
      console.error("Failed to remove student from course", error);
    }
  
  }
  const handleDeleteMessage = async([threadID, messageID, courseID]) => {
    const success = await deleteMessage({threadId: threadID,messageId: messageID, courseId : courseID, courseStoreActions: { removeMessageFromThread}})
    if(success){
      alert("Message deleted succesfully")
      fetchCourseDetails(id)
    }else{
      alert("Failed to delete Message " + message_error);
    }
  }
  const handleDeleteLecture = async(lectureId) => {
    const success = await deleteLecture({id: course.id,lectureID: lectureId ,courseStoreActions: { removeLectureFromCourse}})
    if(success){
      alert("Lecture deleted succesfully")
      fetchCourseDetails(id)
    }else{
      alert("Failed to delete lecture.");
    }
  }
  const handleDeleteAssignment = async(assignmentId) => {
    const success = await deleteAssignment({id: course.id, assignmentID: assignmentId, courseStoreActions: { removeAssignmentFromCourse}})
    if(success){
      alert("Assignment deleted succesfully")
      fetchCourseDetails(id)
    }else{
      alert("Failed to delete Assignment.");
    }
  }
  const handleDeleteTest = async([testID1, courseID]) => {
    const success = await deleteTest({id: courseID, testID: testID1, courseStoreActions:{ removeTestFromCourse} })
    if(success){
      alert("Test deleted successfully")
      fetchCourseDetails(id)
    }else{
      alert("Failed to delete Test.")
    }
  }
  const handleDeleteThread = async(threadID2) => {
    const success = await deleteThread({id: course.id, threadID: threadID2,courseStoreActions: { removeThreadFromCourse} })
    if(success){
      alert("Thread deleted successfully")
      fetchCourseDetails(id)
    }else{
      alert("Failed to delete Thread.")

    }
  }
  const handleAddAssignment = async([assignmentID, courseID]) => {
    saveAssignment([courseID, assignmentID])
    navigate('/home')
  }
  const handleAddCourse = async(courseID) => {
    const course123 = getCoursesById(courseID)
    addCourseToCanvasThunk(course123)
    fetchCourseDetails(id)
    
  }
  const handleDelete = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this course?");
    if (!confirmed) return;

    const result = await deleteCourse(id);
    if (result.success) {
      // After deletion, go back to the main Courses list
      navigate("/courses");
    } else {
      alert("Failed to delete course: " + JSON.stringify(result.error));
    }
  };
  const handleRemoveCourse = async(courseID) => {
    await removeCourseFromCanvasThunk(courseID)
    fetchCourseDetails(id)
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

   const formatPercent = (earned, max) => {
    if (max === 0) return "—";
    const pct = (earned / max) * 100;
    return `${pct.toFixed(1)}%`;
  };

    
  
  const courseTests = course.tests.map((test) => {
    return (
        <tr className="tests">
        <td>{test.id}</td>
        <td>{test.name}</td>
        <td>{test.description}</td>
        <td>{test.max_points}</td>
        <td>{date2(test.date_due)}</td>   
        <td>{renderTestStatus(test)}</td>
        <td><a href={`http://localhost:8000${test.test_file}`} style={{ color: "black" }} target="_blank">{test.test_file}</a></td>
        <td>{ user.is_staff && ( <><Link to={`/editTest/${test.id}/${id}`}><button className="editButton">Edit Test</button></Link><button className="deleteButton" onClick={() => handleDeleteTest([test.id,id])}>Delete Test</button> <Link to={`/staff/tests/${test.id}/submissions`}><Button size="sm">View Submissions</Button></Link> </> )}</td>
        </tr>
    )
  })
  const courseLectures = course.lectures.map((lecture) => {
     return (
     <tr className="lectures">
        <td>{lecture.id}</td>
        <td>{lecture.description}</td>
        <td>{lecture.name}</td>
        <td><a href={`http://localhost:8000${lecture.file}`} style={{ color: "black" }} target="_blank">{lecture.file}</a></td>
        { user.is_staff ? ( <td><Link to={`/editLecture/${id}/${lecture.id}`}><button className="editButton">Edit Lecture</button></Link><button className="deleteButton" onClick={() => handleDeleteLecture(lecture.id)}>Delete Lecture</button></td>): null}
    </tr>
    )
  })
  const courseAssignments = course.assignments.map((assignment) => {
  // Determine if the current user is allowed to see student‐specific fields:

  return (
    <tr className="assignments" key={assignment.id}>
      {/* Assignment ID */}
      <td>{assignment.id}</td>

      {/* Assignment Name */}
      <td>{assignment.name}</td>
      {/* Description */}
      <td>{assignment.description}</td>

      {/* Max Points */}
      <td>{assignment.max_points}</td>

      {/* Date Due */}
      <td>{date2(assignment.date_due)}</td>
      <td>{renderAssignmentStatus(assignment)}</td>
      {/* Assignment File (everyone can see this) */}
      <td>
        <a
          style={{ color: "black" }}
          href={`http://localhost:8000${assignment.assignment_file}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {assignment.assignment_file}
        </a>
        </td>
        <td>{ user.is_staff && ( <><Link to={`/editAssignment/${assignment.id}/${id}`}><button className="editButton">Edit Assignment</button></Link><button className="deleteButton" onClick={() => handleDeleteAssignment([assignment.id,id])}>Delete Assignment</button> <Link to={`/staff/assignments/${assignment.id}/submissions`}><Button size="sm">View Submissions</Button></Link> </> )}</td>
     
    </tr>
  );
});

  const courseProfiles = course.profiles.map((profile) => {
    return (
        <tr className="profiles">
            <td>{profile.id}</td>
            <td>{profile.email}</td>
            <td>{profile.first_name}</td>
            <td> {profile.last_name}</td>
            <td>{profile.date_of_birth}</td>
            <td>{ user.is_staff ? ( <><button className="deleteButton" style={{right: "40px"}} onClick={() => handleDeleteStudent(profile.id)}>Remove Student</button></>): null}</td>
        </tr>
    )
  })
  return (
    <main className="CoursePage">
        <article className="course">
            { course && 
            <>  

                <h2 style={{display: "flex" ,alignItems: "center", justifyContent: "center"}}>{course.name}'s Lectures </h2>
                { doIhaveIt === undefined ? <button className="addClass" onClick={() => handleAddCourse(course.id)}>Enroll Class</button> : <Button onClick={() => handleRemoveCourse(course.id)}>Unenroll class</Button>}
                {user.is_staff ? ( <><Link to={`/addLecture/${id}`} ><button className="addButton" >Add Lecture</button></Link><button className="deleteClass" onClick={handleDelete}>Delete Class</button> </>) : null}
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
                            <th>Description</th>
                            <th>Max Points</th>
                            <th>Date Due</th>
                            <th>Status</th>
                            <th>Assignment File</th>
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
                            <th>Description</th>
                            <th>Max Points</th>
                            <th>Date Due</th>
                            <th>Status</th>
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
  {course && (
    <>
      <h2 style={{ textAlign: "center" }}>Threads</h2>

      {/* Always show “Create Thread” */}
      <div style={{ margin: "1rem 0", textAlign: "center" }}>
        <Link to={`/addThread/${course.id}`}>
          <button className="addButton">Create Thread</button>
        </Link>
      </div>

      {course.threads.length === 0 ? (
        <p style={{ textAlign: "center" }}>No threads yet. Create one above.</p>
      ) : (
        <Table hover>
          <thead>
            <tr>
              <th>Thread ID</th>
              <th>Thread Title</th>
              <th>Thread Created At</th>
              <th>Thread Actions</th>
              <th>Message ID</th>
              <th>Message Body</th>
              <th>Message Author</th>
              <th>Message Timestamp</th>
              <th>Message Actions</th>
            </tr>
          </thead>

          <tbody>
            {course.threads.map((thread) => {
              // If a thread has no messages, we still want to show one row for the thread itself.
              // If it DOES have messages, we show one row per message, repeating the thread columns.
                if (!thread.list_of_messages || thread.list_of_messages.length === 0) {
                  return (
                    <tr key={`thread-${thread.id}`}>
                      <td>{thread.id}</td>
                      <td>{thread.title}</td>
                      <td>{date2(thread.created_at)}</td>
                      <td>
                        <button
                          className="deleteButton"
                          onClick={() => handleDeleteThread(thread.id)}
                        >
                          Delete Thread
                        </button>
                        <button className="editButton">
                          Edit Thread
                        </button>
                        {/* ⬇️ This “Add Message” is specific to this thread */}
                        <Link to={`/addMessage/${thread.id}/${course.id}`}>
                          <button className="addMessage" style={{ marginLeft: "0.5rem" }}>
                            Add Message
                          </button>
                        </Link>
                      </td>
                      {/* No messages to show → just put empty cells for message columns */}
                      <td colSpan={5} style={{ textAlign: "center", color: "#888" }}>
                        (No messages yet)
                      </td>
                    </tr>
                  );
                }

                // If there are messages, show one row per message.
                return thread.list_of_messages.map((message) => (
                  <tr key={`thread-${thread.id}-msg-${message.id}`}>
                    <td>{thread.id}</td>
                    <td>{thread.title}</td>
                    <td>{date2(thread.created_at)}</td>
                    <td>
                      <button
                        className="deleteButton"
                        onClick={() => handleDeleteThread(thread.id)}
                      >
                        Delete Thread
                      </button>
                      <button className="editButton">
                        Edit Thread
                      </button>
                      {/* “Add Message” for THIS thread */}
                      <Link to={`/addMessage/${thread.id}/${course.id}`}>
                        <button className="addMessage" style={{ marginLeft: "0.5rem" }}>
                          Add Message
                        </button>
                      </Link>
                    </td>
                    <td>{message.id}</td>
                    <td>{message.body}</td>
                    <td>{message.author}</td>
                    <td>{date2(message.timestamp)}</td>
                    <td>
                      <Link to={`/editMessage/${course.id}/${thread.id}/${message.id}`}>
                        <button className="editButton">Edit Message</button>
                      </Link>
                      <button
                        className="deleteButton"
                        onClick={() =>
                          handleDeleteMessage([thread.id, message.id, course.id])
                        }
                      >
                        Delete Message
                      </button>
                    </td>
                  </tr>
                ));
              })}
            </tbody>
          </Table>
        )}
      </>
    )}
    </article>
        <article className="profiles">
            { course && 
            <>
            <h2 style={{display: "flex" ,alignItems: "center", justifyContent: "center", paddingBottom: "45px"}}>Students</h2>
             
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