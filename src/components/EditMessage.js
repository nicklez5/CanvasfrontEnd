import React from 'react'
import { useEffect,useState} from 'react';
import { useParams,Link, navigate } from 'react-router-dom';
import { useStoreState, useStoreActions } from 'easy-peasy'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Form, Button, Spinner, Alert } from "react-bootstrap";
const EditMessage = () => {
  const navigate = useNavigate()
  const {courseID, threadID, messageID} = useParams()
  const fetchMessage = useStoreActions((actions) => actions.messageStore.fetchMessage)
  const updateMessage = useStoreActions((actions) => actions.messageStore.updateMessage)
  const {updateMessageInThread, fetchCourseDetails} = useStoreActions((actions) => actions.courseStore)
  const { loading, error} =  useStoreState((state) => state.messageStore)
  const message =  useStoreState((state) => state.messageStore.message);
  const [body, setBody] = useState('')

    useEffect(() => {
     if (!messageID) return;
    // Dispatch the thunk that populates `state.messageStore.message`
        fetchMessage(messageID);
    }, [messageID, fetchMessage])
    useEffect(() =>{
     if (message && message.body !== undefined) {
      setBody(message.body );
     }
    },[message])
    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateMessage({
        threadId: threadID,
        messageId: messageID,
        messageData: { body },
        courseId: courseID,
        courseStoreActions: { updateMessageInThread },
        });
        if (!error) {
        navigate(`/courses/${courseID}`);

        }
    };
    return (
    <div className="container mt-4" style={{paddingBottom: "70vh"}}>
      <h2 style={{paddingTop: "25vh", position: "relative", left: "50vh", bottom:"25px"}}>Edit Message #{messageID}</h2>

      {loading && (
        <div className="d-flex align-items-center my-3">
          <Spinner animation="border" size="sm" role="status" className="me-2" />
          <span>Loading message…</span>
        </div>
      )}

      {error && (
        <Alert variant="danger" className="mt-3">
          {error}
        </Alert>
      )}

      {!loading && (
        <Form onSubmit={handleSubmit} className="mt-3">
          <Form.Group controlId="messageBody">
            <Form.Label style={{ position: "relative", left:"55vh"}}>Message Body</Form.Label>
            <Form.Control
              style={{textAlign: "center", right:"10vh", position: "relative"}}
              as="textarea"
              name="body"
              rows={4}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type your message here…"
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading} className="mt-3" style={{ width: "40vh", position: "relative", left:"25vh"}}>
            {loading ? "Saving…" : "Save Changes"}
          </Button>
        </Form>
      )}
    </div>
  );
};

export default EditMessage