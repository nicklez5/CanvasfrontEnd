import React from 'react'
import { useEffect,useState} from 'react';
import { useParams,Link, navigate } from 'react-router-dom';
import { useStoreState, useStoreActions } from 'easy-peasy'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Form, Button, Spinner, Alert,Container } from "react-bootstrap";
const EditMessage = () => {
  const navigate = useNavigate()
  const {courseID, threadID, messageID} = useParams()
  const fetchMessage = useStoreActions((actions) => actions.messageStore.fetchMessage)
  const updateMessage = useStoreActions((actions) => actions.messageStore.updateMessage)
  const {updateMessageInThread, fetchCourseDetails} = useStoreActions((actions) => actions.courseStore)
  const message =  useStoreState((state) => state.messageStore.message);
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('')
    useEffect(() => {
     if (!messageID) return;
        setLoading(true);
        fetchMessage(messageID);
        setLoading(false)
    }, [messageID, fetchMessage])
    useEffect(() =>{
     if (message && message.body !== undefined) {
      setBody(message.body );
     }
    },[message])
    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await updateMessage({
              threadId: threadID,
              messageId: messageID,
              messageData: { body },
              courseId: courseID,
              courseStoreActions: { updateMessageInThread },
        });
        if(result.success){
          navigate(`/courses/${courseID}`)
        }else{
          const err =
            typeof result.error === "string"
              ? result.error
              : JSON.stringify(result.error);
          setErrorMsg(err);
        }
    };
    return (
    <Container className="mt-4" style={{position: "relative" , top: "60px", maxWidth: "800px",padding: "120px", backgroundColor: "#DA6464", marginBottom: "44vh"}}>
      <h2 style={{left: "150px"}}>Edit Message #{messageID}</h2>

      {loading && (
        <div className="d-flex align-items-center my-3">
          <Spinner animation="border" size="sm" role="status" className="me-2" />
          <span>Loading message…</span>
        </div>
      )}

      {errorMsg && (
        <Alert variant="danger" className="mt-3">
          {errorMsg}
        </Alert>
      )}

      {!loading && (
        <Form onSubmit={handleSubmit} className="mt-3">
          <Form.Group controlId="messageBody">
            <Form.Label>Message Body</Form.Label>
            <Form.Control
              as="textarea"
              name="body"
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type your message here…"
              required
            />
          </Form.Group>

          <Button variant="danger" type="submit" disabled={loading} className="mt-3" style={{ width: "40vh", position: "relative", left:"7.5vh", backgroundColor: "#DA6464", color: "white"}}>
            {loading ? "Saving…" : "Save Changes"}
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default EditMessage