import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { useParams,Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Container,
  Form,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
const NewAssignment = () => {
    const {courseID} = useParams() 
    const createAssignment = useStoreActions((actions) => actions.assignmentStore.createAssignment)
    const  {addAssignmentInCourse} = useStoreActions((actions) => actions.courseStore)
    const fetchCourseDetails = useStoreActions((actions) => actions.courseStore.fetchCourseDetails)
    const navigate = useNavigate()
    const [assignment_file, setAssignmentFile] = useState(null)
    const [name, setName] = useState('')
    const [date_due, setDateDue] = useState('')
    const [description, setDescription] = useState('')
    const [max_points, setMaxPoints] = useState('')
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false)

    const handleNameChange = (e) => setName(e.target.value);
    const handleDescChange = (e) => setDescription(e.target.value)
    const handleDateChange = (e) => setDateDue(e.target.value)
    const handleMaxChange = (e) => setMaxPoints(e.target.value)
    const handleFileChange = (e) => {
        setAssignmentFile(e.target.files[0] || null);
    }


    const handleSubmit = async(e) => {
        e.preventDefault();
        setErrorMsg("");
        if(!name.trim()){
            setErrorMsg("Assignment name cannot be empty");
            return;
        }
        if(!description.trim()){
            setErrorMsg("Description cannot be empty");
            return;
        }
        if(!date_due){
            setErrorMsg("Please pick a due date");
            return;
        }
        if(!max_points || isNaN(max_points)){
            setErrorMsg("Enter a valid number for max points.")
            return;
        }
        const formatDate = (date) => {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2,'0')
            const day =  String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}`
        }
        const datetime = formatDate(new Date(date_due))
        const newAssignment = {name: name, description: description, date_due: datetime, assignment_file: assignment_file, max_points: max_points }
        try{
            setLoading(true);
            const result = await createAssignment({assignmentData: newAssignment, id: courseID, courseStoreActions : { addAssignmentInCourse}})
            setLoading(false);
            if(result.success){
                fetchCourseDetails(courseID);
                navigate(`/courses/${courseID}`)
            }else{
                const err = typeof result.error === "string" ? result.error : JSON.stringify(result.error);
                setErrorMsg(err)
            }
            
        }catch(error){
            console.error("Error creating the Assignment:",error)
        }

    }
    return(
        <Container className="mt-4" style={{ position: "relative", top: "40px", maxWidth: "800px", padding: "120px", backgroundColor: "#3B82F6", color: "white", marginBottom:"34vh" }}>
            <h2 style={{left: "150px", bottom:"40px"}}>Create Assignment</h2>
            
            {loading && (
                <div className="d-flex align-items my-3">
                    <Spinner animation="border" size="sm" className="me-2" />
                    <span>Creating Assignment...</span>
                </div>
            )}
            {errorMsg && (
                    <Alert variant="danger" className="my-3">
                      {errorMsg}
                    </Alert>
            )}

            <Form onSubmit={handleSubmit} className="mt-3">
            {/* ─── Name ───────────────────────────────────────────────────────────── */}
            <Form.Group controlId="assignmentName" className="mb-3">
            <Form.Label>Assignment Name</Form.Label>
            <Form.Control
                type="text"
                placeholder="Enter assignment name"
                value={name}
                onChange={handleNameChange}
                required
            />
            </Form.Group>

            {/* ─── Description ─────────────────────────────────────────────────────── */}
            <Form.Group controlId="assignmentDescription" className="mb-3">
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

            {/* ─── Date Due ────────────────────────────────────────────────────────── */}
            <Form.Group controlId="assignmentDueDate" className="mb-3">
            <Form.Label>Due Date &amp; Time</Form.Label>
            <Form.Control
                type="datetime-local"
                value={date_due}
                onChange={handleDateChange}
                required
            />
            </Form.Group>

            {/* ─── Max Points ──────────────────────────────────────────────────────── */}
            <Form.Group controlId="assignmentMaxPoints" className="mb-3">
            <Form.Label>Max Points</Form.Label>
            <Form.Control
                type="number"
                min="0"
                placeholder="Total points possible"
                value={max_points}
                onChange={handleMaxChange}
                required
            />
            </Form.Group>

            {/*─────File ──────────────────────────────────────────────────────────────*/}
            <Form.Group controlId="assignmentFile" className="mb-3">
                <Form.Label>Assignment File</Form.Label>
                <Form.Control
                    type="file"
                    onChange={handleFileChange}
                />
            </Form.Group>
            {/* ─── Submit Button ───────────────────────────────────────────────────── */}
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
export default NewAssignment