import React from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { useParams,Link } from 'react-router-dom';
import { useState } from 'react';
import { Container, Form, Button, Spinner, Alert} from "react-bootstrap"
const NewMessage = () => {
    const {courseID, threadID} = useParams()
    const getCoursesById = useStoreState((state) => state.courseStore.getCoursesById)
    const course = getCoursesById(courseID)
    const createMessage = useStoreActions((actions) => actions.messageStore.createMessage)
    const {addMessageToThread} = useStoreActions((actions) => actions.courseStore)
    const fetchCourseDetails = useStoreActions((actions) => actions.courseStore.fetchCourseDetails)
    const [body, setBody] = useState('')
    const [loading,setLoading] = useState(false)
    const [errorMsg,setErrorMsg] = useState('')
    const navigate = useNavigate()
    const handleBodyChange = (e) => setBody(e.target.value)
    const handleSubmit = async(e) => {
        e.preventDefault();
        const newMessage = {body: body}
        try{
            setLoading(true);
            const result = await createMessage({threadId: threadID, messageData: newMessage, courseId: courseID, courseStoreActions : {  addMessageToThread}})
            setLoading(false);
            if(result.success){
              fetchCourseDetails(courseID)
              navigate(`/courses/${courseID}`)
            }else{
              const err = typeof result.error === 'string' ? result.error : JSON.stringify(result.error)
              setErrorMsg(err)
            }
        }catch(error){
            console.error("Error creating the message:", error)
        }
    }
  return (
     <Container className="mt-4" style={{position: "relative", top: "80px",maxWidth: "900px", padding: "120px", backgroundColor: "#0B0E16",fontFamily: "Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif",marginBottom: "60vh", color: "white"}}>
       <h2 style={{left: "20px", fontSize: "30px"}}>New Message for Thread ID: {threadID} in "{course?.name}"</h2>
       {errorMsg && (
          <Alert variant="danger" className="my-3">
            {errorMsg}
          </Alert>
        )}
       <Form onSubmit={handleSubmit} className="mt-3">
        <Form.Group controlId="messageBody" className="mb-3">
          <Form.Label style={{left: "250px"}}>Message Body</Form.Label>
          <Form.Control
            as="textarea"
            rows={6}
            placeholder="Enter your message"
            value={body}
            onChange={handleBodyChange}
            required
            />
        </Form.Group>
        <Button variant="primary" type="submit" style={{position: "relative", width: "200px", backgroundColor: "#03081B", color: "white",fontFamily: "Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif", left: "200px"}} disabled={loading}>
            {loading ? (
                <>
                    <Spinner animation="border" size="sm" className="me-2"/>
                    Saving…
                </>
            ) : (
                "Save Changes"
            )}
        </Button>
       </Form>
     </Container>
  )
}

export default NewMessage