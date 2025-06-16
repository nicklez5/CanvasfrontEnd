import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { useParams,Link } from 'react-router-dom';
import { useState } from 'react';
import { Container, Form, Button, Spinner, Alert} from "react-bootstrap";
const NewLecture = () => {
    const {courseID} = useParams() 
    const getCoursesByID = useStoreState((state) => state.courseStore.getCoursesById);
    const createLecture = useStoreActions((actions) => actions.lectureStore.createLecture)
    const  {addLectureInCourse} = useStoreActions((actions) => actions.courseStore)
    const fetchCourseDetails = useStoreActions((actions) => actions.courseStore.fetchCourseDetails)
    const course = getCoursesByID(courseID)
    const [description, setDescription] = useState('')
    const [name, setName] = useState('')
    const [file,setFile] = useState(null)
    const navigate = useNavigate()

    const [errorMsg, setErrorMsg] = useState("")
    const [loading, setLoading ] = useState(false)
    const handleNameChange = (e) => setName(e.target.value)
    const handleDescChange = (e) => setDescription(e.target.value)
    const handleFileChange = (e) => {
        setFile(e.target.files[0] || null);
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        setErrorMsg("");
        if(!name.trim()){
            setErrorMsg("Lecture name cannot be empty")
            return
        }
        if(!description.trim()){
            setErrorMsg("Description cannot be empty");
            return;
        }

        const newLecture = {file: file, name: name, description: description}
        try{
            setLoading(true)
            const result = await createLecture({LectureData: newLecture,id:courseID, courseStoreActions : { addLectureInCourse}})
            setLoading(false)
            if(result.success){
                fetchCourseDetails(courseID);
                navigate(`/courses/${courseID}`)
            }else{
                const err = typeof result.error === "string" ? result.error : JSON.stringify(result.error);
                setErrorMsg(err)
            }
        }catch(error){
            console.error("Error creating the lecture:",error)
        }
    }
    return(
        <Container className="mt-4" style={{ position: "relative", top: "40px", maxWidth: "800px", padding: "120px", backgroundColor: "#CFE3E9", color: "black", marginBottom: "34vh",fontFamily: "Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif" }}>
            <h2 style={{left: "150px", bottom: "40px"}}>Create Lecture</h2>
            {loading && (
                <div className="d-flex align-items my-3">
                    <Spinner animation="border" size="sm" className="me-2"/>
                    <span>Creating Lecture...</span>
                </div>
            )}
            {errorMsg && (
                <Alert variant="danger" className="my-3">
                    {errorMsg}
                </Alert>
            )}
            <Form onSubmit={handleSubmit} className="mt-3">
            <Form.Group controlId="lectureName" className="mb-3">
                <Form.Label>Lecture Name</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Enter lecture name"
                    value={name}
                    onChange={handleNameChange}
                    required
                />
            </Form.Group>
            <Form.Group controlId="lectureDescription" className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter a brief description"
                value={description}
                onChange={handleDescChange}
                required
            />
            </Form.Group>
            <Form.Group controlId="lectureFile" className="mb-3">
                <Form.Label>File</Form.Label>
                <Form.Control
                    type="file"
                    onChange={handleFileChange}
                />
            </Form.Group>
            <Button variant="primary" type="submit" style={{position: "relative", width: "200px", backgroundColor: "#3B82F6", color: "white",top: "30px",left: "170px", fontFamily: "Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif", padding: "15px"}} disabled={loading}>
            {loading ? (
                <>
                <Spinner animation="border" size="sm" className="me-2" />
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
export default NewLecture