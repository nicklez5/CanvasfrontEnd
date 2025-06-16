import { useStoreActions, useStoreState } from 'easy-peasy';
import React, {useState , useEffect} from 'react'
import { useNavigate, useParams} from "react-router-dom"
import {Container,Form,Button, Spinner,Alert, Table} from "react-bootstrap"
const NewThread = () => {
  const navigate = useNavigate()
  const {id} = useParams()
  const [title,setTitle] = useState('')
  const [loading,setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const  createThread = useStoreActions((actions) => actions.threadStore.createThread)
  const getCoursesById = useStoreState((state) => state.courseStore.getCoursesById)
  const {addThreadInCourse} = useStoreActions((actions) => actions.courseStore)
  const {fetchCourseDetails} = useStoreActions((actions) => actions.courseStore)
  const handleTitleChange = (e) => setTitle(e.target.value);
  useEffect(() => {

  })
  const handleSubmit = async(e) => {
    e.preventDefault();
    const newThread = {title: title}
    try{
        await createThread({threadData: newThread, id: id, courseStoreActions: {addThreadInCourse}})
        fetchCourseDetails(id);
        navigate(`/courses/${id}`)
    }catch(error){
        console.error("Error creating the thread:",error)
    }
    
  }
  return (
    <Container className="mt-4" style={{position: "relative", maxWidth: "800px", padding: "120px", backgroundColor: "#03081B", marginBottom: "55vh", top:"20vh", color: "white"}}>
      <h2 style={{left: "170px"}}>New Thread</h2>
      {errorMsg && (
        <Alert variant="danger" className="my-3">
          {errorMsg}
        </Alert>
      )}
      <Form onSubmit={handleSubmit} className="mt-3">
        <Form.Group controlId="threadTitle" className="mb-3">
          <Form.Label style={{left: "12.5px"}}>Thread Title</Form.Label>
          <Form.Control 
            type="text"
            placeholder="Enter thread title"
            value={title}
            onChange={handleTitleChange}
            required
            />
        </Form.Group>
        <Button variant="primary" type="submit" style={{position: "relative", width: "200px", backgroundColor: "#03081B", color: "white",fontFamily: "Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif", left: "170px"}} disabled={loading}>
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

export default NewThread