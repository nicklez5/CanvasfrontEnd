import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import { useStoreState, useStoreActions} from "easy-peasy"
import {Table,Button,Modal,Spinner} from "react-bootstrap"
import { fr } from 'date-fns/locale/fr';
import {format , formatInTimeZone} from 'date-fns-tz'
import api from '../../api/courses';

const ViewGrades = () => {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null)
  const [loadingDetails, setLoading] = useState(false)
  const [errorDetails, setError] = useState(null)
  const {courseID} = useParams()
  const student_id = useStoreState((s) => s.userStore.user.pk)
  const grades = useStoreState((s) => s.submissionStore.myGrades) || {};
  const assignments = grades.assignments || [];
  const tests = grades.tests || [];
  const fetchMyGrades = useStoreActions((a) => a.submissionStore.fetchMyGrades)
  useEffect(() => {
    console.log(typeof student_id)
    const courseId = parseInt(courseID,10)
    fetchMyGrades({courseID: courseId,student_id: student_id})
    console.log(JSON.stringify(grades))
  },[student_id, fetchMyGrades, courseID,grades])
  const handleFetchAssignmentDetails = async(assignmentId) => {
    setLoading(true)
    setError(null)
    try{
        const resp = await api.get(`/assignments/detail/${assignmentId}/`)
        setSelected(resp.data)
        setShowModal(true)
    }catch(err){
        setError(err.message || "Failed to load details");
    }finally{
        setLoading(false)
    }
  }
  const handleClose = () => {
    setShowModal(false)
    setSelected(null)
  }
  const handleFetchTestDetails = async(testId) => {
    setLoading(true)
    setError(null)
    try{
        const resp = await api.get(`/tests/detail/${testId}/`)
        setSelected(resp.data)
        setShowModal(true)
    }catch(err){
        setError(err.message || "Failed to load details")
    }finally{
        setLoading(false)
    }
  }
  const renderTestGrade = (test) => {
    if(test.student_points == null){
        return <span>Not yet Graded</span>
    }
    const pct = ((test.student_points / test.test_max_points) * 100).toFixed(1);
    return(
        <>
        <span>{test.student_points} / {test.test_max_points}</span>
        <br />
        <small>({pct}%)</small>
        </>
    )
  }
  const renderAssignmentGrade = (assignment) => {
    if(assignment.student_points == null){
        return <span>Not yet Graded</span>
    }
    const pct = ((assignment.student_points / assignment.assignment_max_points) * 100).toFixed(1)
    return (
        <>
        <span>{assignment.student_points} / {assignment.assignment_max_points}</span>
        <br />
        <small>({pct}%)</small>
        </>
    )
    }
  const date2 = (date) => {
    if(!date) return "Not yet Graded";
    return formatInTimeZone(date, 'UTC', 'MM/dd/yyyy hh:mm a')
  }
//   const formattedDate2 = (date) => {
//     if(!date) return "Not yet Graded";
//     const milliClean = date.replace(/\.(\d{3})\d*/,".$1")
//     const iso = milliClean.endsWith("Z") ? milliClean : milliClean + "Z"
//     const d = new Date(iso)
//     if(isNaN(d)) return "";
//     return formatInTimeZone(d,"UTC","MM/dd/yyyy hh:mm a");
//   }
  return (
    <div className="ViewGrades">
        <h2>Assignment Grades</h2>
        {assignments.length === 0 ? ( 
            <p>No submissions yet</p>
        ) : (
            <>
        <Table responsive="xl" hover bordered variant="dark">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Assignment Name</th>
                    <th>Grade</th>
                    <th>Submitted At</th>
                    <th>Student Name</th>
                    <th style={{textAlign: "center"}}>Submitted File</th>
                    <th>Graded At</th>
                    <th>Graded By</th>
                    <th>Feedback</th>
                </tr>
            </thead>
            <tbody>
                {assignments.map((assignment) => 
                    <tr key={assignment.id}>
                        <td>
                            <Button
                                variant="link"
                                size="sm"
                                onClick={() => handleFetchAssignmentDetails(assignment.id)}
                            >
                                {assignment.id}
                            </Button>
                        </td>
                        <td>{assignment.assignment_name}</td>
                        <td>{renderAssignmentGrade(assignment)}</td>
                        <td>{date2(assignment.submitted_at)}</td>
                        <td>{assignment.student_username}</td>
                        <td>
                            <a 
                            style={{color: "white"}} 
                            href={`http://localhost:8000${assignment.student_file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            >{assignment.student_file}</a>
                        </td>
                        <td>{date2(assignment.graded_at)}</td>
                        <td>{assignment.graded_by_name === null ? (<p>Not yet Graded</p>) : (assignment.graded_by_name)}</td>
                        <td>{assignment.feedback === "" ? (<p>No feedback yet</p>): (assignment.feedback)}</td>
                    </tr>
                )}
            </tbody>
        </Table>
        <Modal show={showModal} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    {loadingDetails ? "Loading..." : selected?.name || "Details"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loadingDetails && (
                    <div className="text-center">
                        <Spinner animation="border"/>
                    </div>
                )}
                {errorDetails && (
                    <div className="text-danger text-center">{errorDetails}</div>   
                )}
                {!loadingDetails && !errorDetails && selected && (
                    <>
                    <p><strong>ID: </strong>{selected.id}</p>
                    <p><strong>Name: </strong>{selected.name}</p>
                    <p><strong>Description: </strong>{selected.description}</p>
                    <p><strong>Max Points: </strong>{selected.max_points}</p>
                    <p><strong>Due: </strong>{date2(selected.date_due)}</p>
                    {selected.assignment_file && (
                        <p>
                            <strong>File: </strong>{" "}
                            <a 
                                style={{color: "black"}}
                                href={`${selected.assignment_file}`}
                                target="_blank"
                                rel="noreferrer"
                            >Download</a>
                        </p>
                    )}
                    </>
                )}
            </Modal.Body>
        </Modal>
        </>
        )}
        <h2>Test Grades</h2>
        {tests.length === 0 ? (
            <p>No Submissions yet</p>
        ): (
            <>
            <Table responsive="xl" hover bordered variant="dark">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Test Name</th>
                        <th>Grade</th>
                        <th>Submitted At</th>
                        <th>Student Name</th>
                        <th style={{textAlign: "center"}}>Submitted File</th>
                        <th>Graded At</th>
                        <th>Graded By</th>
                        <th>Feedback</th>
                    </tr>
                </thead>
                <tbody>
                    {tests.map((test) => 
                        <tr key={test.id}>
                            <td>
                                <Button 
                                    variant="link"
                                    size="sm"
                                    onClick={() => handleFetchTestDetails(test.id)}
                                >{test.id}
                                </Button>
                            </td>
                            <td>{test.test_name}</td>
                            <td>{renderTestGrade(test)}</td>
                            <td>{date2(test.submitted_at)}</td>
                            <td>{test.student_username}</td>
                            <td>
                                <a 
                                style={{color: "white"}}
                                href={`http://localhost:8000${test.student_file}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                >{test.student_file}</a>
                            </td>
                            <td>{date2(test.graded_at)}</td>
                            <td>{test.graded_by_name === null ? (<p>Not yet Graded</p>) : (test.graded_by_name)}</td>
                            <td>{test.feedback === "" ? (<p>No Feedback yet</p>): (test.feedback)}</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            <Modal show={showModal} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {loadingDetails ? "Loading..." : selected?.name || "Details"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loadingDetails && (
                        <div className="text-center">
                            <Spinner animation="border"/>
                        </div>
                    )}
                    {errorDetails && (
                        <div className="text-danger text-center">{errorDetails}</div>
                    )}
                    {!loadingDetails && !errorDetails && selected && (
                        <>
                        <p><strong>ID: </strong>{selected.id}</p>
                        <p><strong>Name: </strong>{selected.name}</p>
                        <p><strong>Description: </strong>{selected.description}</p>
                        <p><strong>Max Points: </strong>{selected.max_points}</p>
                        <p><strong>Due: </strong>{date2(selected.date_due)}</p>
                        {selected.test_file && (
                            <p>
                                <strong>File: </strong>{" "}
                                <a
                                  style={{color: "black"}}
                                  href={`${selected.test_file}`}
                                  target="_blank"
                                  rel="noreferrer"
                                >Download</a>
                            </p>
                        )}
                        </>
                    )}
                </Modal.Body>
            </Modal>
            </>
        )}
    </div>
  )
}

export default ViewGrades