import { useParams, Link, useLocation} from "react-router-dom"
import { useNavigate} from "react-router-dom"
import { useStoreState, useStoreActions ,useStoreRehydrated} from "easy-peasy"
import { Table, Button, Spinner, Dropdown } from "react-bootstrap"
import { useEffect,useState, useContext } from "react"
import useAxiosFetch from '../../hooks/useAxiosFetch';
import styles from "./modules/CoursePage.module.css"
import {parseISO } from "date-fns"
import { fr   } from 'date-fns/locale/fr';
import { format,formatInTimeZone } from 'date-fns-tz';
import axios from "axios"
import api from "../../api/courses"
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
          <Button className={styles.submitSubmissions} >Submit Test</Button>
        </Link>
      );
    }

    if (sub.student_points == null) {
      // Submitted but not graded
      return <span style={{textAlign: "center"}}>Submitted</span>;
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
          <Button className={styles.submitSubmissions}>Submit Assignment</Button>
        </Link>
      );
    }

    // If submission exists but not graded
    if (sub.student_points == null) {
      return <span style={{textAlign: "center"}}>Submitted</span>;
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
    const result = await deleteMessage({threadId: threadID,messageId: messageID, courseId : courseID, courseStoreActions: { removeMessageFromThread}})
    if(result.success){
      alert("Message deleted succesfully")
    }else{
      const err = typeof result.error === "string" ? result.error : JSON.stringify(result.error);
      alert(`Failed to Delete Message Error: ${err}`);
    }
    fetchCourseDetails(id)
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
    try{
      const success = await deleteThread({id: course.id, threadID: threadID2,courseStoreActions: { removeThreadFromCourse} })
      if(success){
        alert("Deleted Thread successfully")
      }else{
        alert("Failed to Delete Thread your not the owner")
      }
      fetchCourseDetails(id)
    }catch(error){
      alert("Failed to delete Thread.")
    }
    // const success = await deleteThread({id: course.id, threadID: threadID2,courseStoreActions: { removeThreadFromCourse} })
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
        <td style={{textAlign: "center"}}><a href={`http://localhost:8000${test.test_file}`} style={{ color: "white" }} target="_blank">{test.test_file}</a></td>
        {user.is_staff ?
          (
            <Dropdown>
              <Dropdown.Toggle variant="info" id="dropdown-basic" style={{position: "relative", textAlign: "center", left: "45px", padding:"12.5px"}}>
                Options
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item className={styles.dropdown_item} href={`/editTest/${test.id}/${id}`}>Edit Test</Dropdown.Item>
                <Dropdown.Item className={styles.dropdown_item_danger} onClick={() => handleDeleteTest([test.id,id])}>Delete Test</Dropdown.Item>
                <Dropdown.Item className={styles.dropdown_item_edit} href={`/staff/tests/${test.id}/submissions`}>View Submissions</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ): <td></td>
        }
        </tr>
    )
  })
  const courseLectures = course.lectures.map((lecture) => {
     return (
     <tr className="lectures">
        <td>{lecture.id}</td>
        <td>{lecture.description}</td>
        <td>{lecture.name}</td>
        <td style={{textAlign: "center"}}><a href={`http://localhost:8000${lecture.file}`} style={{ color: "white" }} target="_blank">{lecture.file}</a></td>
        { user.is_staff ? 
            ( 
            <Dropdown>
              <Dropdown.Toggle variant="info" id="dropdown-basic" style={{position: "relative" ,textAlign: "center", left: "55px"}}>
                Options
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item className={styles.dropdown_item} href={`/editLecture/${id}/${lecture.id}`}>Edit Lecture</Dropdown.Item>
                <Dropdown.Item className={styles.dropdown_item_danger} onClick={() => handleDeleteLecture(lecture.id)}>Delete Lecture</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> ) : <td></td>} 
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
      <td style={{textAlign: "center"}}>
        <a
          style={{ color: "white" }}
          href={`http://localhost:8000${assignment.assignment_file}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {assignment.assignment_file}
        </a>
        </td>
        { user.is_staff ? ( 

          <Dropdown>
            <Dropdown.Toggle variant="info" id="dropdown-basic" style={{position: "relative", textAlign: "center", left: "20px", padding: "12.5px"}}>
              Options
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item className={styles.dropdown_item} href={`/editAssignment/${assignment.id}/${id}`}>Edit Assignment</Dropdown.Item>
              <Dropdown.Item className={styles.dropdown_item_danger} onClick={() => handleDeleteAssignment([assignment.id,id])}>Delete Assignment</Dropdown.Item>
              <Dropdown.Item className={styles.dropdown_item_edit} href={`/staff/assignments/${assignment.id}/submissions`}>View Submissions</Dropdown.Item>
            </Dropdown.Menu>
              
          </Dropdown> ) : <td></td>}
     
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
            <td>{ user.is_staff ? ( <><button className="deleteButton" style={{left: "10px"}} onClick={() => handleDeleteStudent(profile.id)}>Remove Student</button></>): null}</td>
        </tr>
    )
  })
  return (
    <main className="CoursePage">
        <article className={styles.lectures}>
            { course && 
            <>  

                <h1 class="mb-5 ps-2" style={{display: "flex" ,alignItems: "center", justifyContent: "center"}}>{course.name.toUpperCase()}

                </h1>
                <h2 style={{display: "flex", alignItems: "center", justifyContent: "center"}}>Lectures </h2>
                { doIhaveIt === undefined ? <Button className={styles.enrollClass} onClick={() => handleAddCourse(course.id)}>Enroll Class</Button> : <Button className={styles.unEnrollClass} onClick={() => handleRemoveCourse(course.id)}>Unenroll class</Button>}
                {user.is_staff ? ( <Button className={styles.deleteClass} onClick={() => handleDelete(course.id)}>Delete Class</Button> ) : null}
                {user.is_staff ? ( <Link to={`/addLecture/${id}`}><Button className={styles.addLecture}>Add Lecture</Button></Link>  ) : null}
                <Table responsive="xl" hover bordered variant="dark">
                    <thead>
                        <tr>
                            <th>Lecture ID</th>
                            <th>Description</th>
                            <th>Lecture Name</th>
                            <th style={{textAlign: "center"}}>Lecture File</th>
                            <th style={{textAlign: "center"}}>Actions</th>
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
            {user.is_staff ? ( <><Link to={`/addAssignment/${id}`} ><button className={styles.addAssignment} >Add Assignment</button></Link> </>): null}
                <Table responsive="xl" hover bordered variant="dark">
                    <thead>
                        <tr>
                            <th>Assignment ID</th>
                            <th>Assignment Name</th>
                            <th>Description</th>
                            <th>Max Points</th>
                            <th>Date Due</th>
                            <th style={{textAlign: "center"}}>Status</th>
                            <th style={{textAlign: "center"}}>Assignment File</th>
                            <th style={{textAlign: "center"}}>Actions</th>
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
            {user.is_staff ? ( <><Link to={`/addTest/${id}`} ><button className={styles.addTest}>Add Test</button></Link> </> ) : null}
                <Table responsive="xl" hover bordered variant="dark">
                    <thead>
                        <tr>
                            <th>Test ID</th>
                            <th>Test Name</th>
                            <th>Description</th>
                            <th>Max Points</th>
                            <th>Date Due</th>
                            <th style={{textAlign: "center"}}>Status</th>
                            <th style={{textAlign: "center"}}>File</th>
                            <th style={{textAlign: "center"}}>Actions</th>
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
          <button className={styles.addThread}>Create Thread</button>
        </Link>
      </div>

      {course.threads.length === 0 ? (
        <p style={{ textAlign: "center" }}>No threads yet. Create one above.</p>
      ) : (
        <Table responsive="xl" hover bordered variant="dark">
          <thead>
            <tr>
              <th>Thread ID</th>
              <th>Thread Title</th>
              <th>Thread Created At</th>
              <th>Thread Author</th>
              <th style={{textAlign: "center"}}>Thread Actions</th>
              <th>Message ID</th>
              <th>Message Body</th>
              <th>Message Author</th>
              <th>Message Timestamp</th>
              <th style={{textAlign: "center"}}>Message Actions</th>
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
                      <td>{thread.author}</td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle variant="primary" id="dropdown-basic" style={{position: "sticky", textAlign: "center", left: "25px"}}>
                            Options
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item className={styles.dropdown_item_danger} onClick={() => handleDeleteThread(thread.id)}>Delete Thread</Dropdown.Item>
                            <Dropdown.Item className={styles.dropdown_item_edit} href={`/editThread/${id}/${thread.id}`}>Edit Thread</Dropdown.Item>
                            <Dropdown.Item className={styles.dropdown_item} href={`/addMessage/${thread.id}/${id}`}>Add Message</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
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
                    <td>{thread.author}</td>
                    <td>
                      <Dropdown>
                          <Dropdown.Toggle variant="primary" id="dropdown-basic" style={{position: "sticky", textAlign: "center", left: "25px",padding:"12.5px"}}>
                            Options
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item className={styles.dropdown_item_danger} onClick={() => handleDeleteThread(thread.id)}>Delete Thread</Dropdown.Item>
                            <Dropdown.Item className={styles.dropdown_item_edit} href={`/editThread/${id}/${thread.id}`}>Edit Thread</Dropdown.Item>
                            <Dropdown.Item className={styles.dropdown_item} href={`/addMessage/${thread.id}/${id}`}>Add Message</Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                    </td>
                    <td>{message.id}</td>
                    <td>{message.body}</td>
                    <td>{message.author}</td>
                    <td>{date2(message.timestamp)}</td>
                    <td>
                      <Dropdown>
                        <Dropdown.Toggle variant="info" id="dropdown-basic" style={{position: "sticky", textAlign: "center", left: "25px", padding: "12.5px"}}>
                          Options
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item className={styles.dropdown_item_edit} href={`/editMessage/${course.id}/${thread.id}/${message.id}`}>Edit Message</Dropdown.Item>
                          <Dropdown.Item className={styles.dropdown_item_danger} onClick={() => handleDeleteMessage([thread.id,message.id,course.id])}>Delete Message</Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
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
             
                <Table responsive="xl" hover bordered variant="dark">
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Email</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Date of Birth</th>
                            <th style={{textAlign: "center"}}>Actions</th>
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