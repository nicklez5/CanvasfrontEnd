import React, {useEffect, useState} from "react";
import {useParams, useNavigate} from "react-router-dom"
import {useStoreActions, useStoreState} from "easy-peasy"
import {Container,Form,Button, Spinner,Alert, Table} from "react-bootstrap"
import { format,formatInTimeZone } from 'date-fns-tz';
const EditThread = () => {
    const {threadID, courseID} = useParams();
    const navigate = useNavigate();
    const fetchThread = useStoreActions((a) => a.threadStore.fetchThread);
    const updateThread = useStoreActions((a) => a.threadStore.updateThread);
    const {updateThreadInCourse} = useStoreActions((a) => a.courseStore)
    const username = useStoreState((s) => s.userStore.user.username)
    const thread = useStoreState((s) => s.threadStore.thread)

    const [loading,setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("")

    const [title,setTitle] = useState("")
    useEffect(() => {
        const load = async() => {
            setLoading(true);
            await fetchThread(threadID);
            setLoading(false)
        };
        load();
    },[fetchThread, threadID]);
    useEffect(() => {
        if(thread){
            setTitle(thread.title || "");
        }
    },[thread])
    const date2 = (date) => {
        return formatInTimeZone(date, 'UTC', 'MM/dd/yyyy hh:mm a')
      }
    const handleTitleChange = (e) => setTitle(e.target.value);
    const handleSubmit = async(e) => {
        e.preventDefault();
        setErrorMsg("");
        if(!title.trim()){
            setErrorMsg("Thread title cannot be empty");
            return;
        }
        const updatedData = {
            author: username,
            title: title.trim(),
            id: thread.id
        }
        const payload = {
            updatedData,
            courseID,
            courseStoreActions: { updateThreadInCourse}
        }
        setLoading(true);
        const result = await updateThread(payload);
        setLoading(false)
        if(result.success){
            navigate(`/courses/${courseID}`);
        }else{
            const err = typeof result.error === "string" ? result.error : JSON.stringify(result.error);
            setErrorMsg(err);
        }
    }
    return(
        <Container className="mt-4" style={{position: "relative", maxWidth: "800px", padding: "120px", backgroundColor: "#03081B", marginBottom: "95vh",top: "20vh", color: "white"}}>
            <h2 style={{left: "170px"}}>Edit Thread #{threadID}</h2>
            {loading && !thread && (
                <div className="d-flex align-items-center my-3">
                    <Spinner animation="border" size="sm" className="me-2" />
                    <span>Loading Thread...</span>
                </div>
            )}
            {errorMsg && (
                <Alert variant="danger" className="my-3">
                    {errorMsg}
                </Alert>
            )}
            {thread && (
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
                    {thread.list_of_messages.length === 0 ? (
                        <p style={{textAlign: "center"}}>No messages yet.</p>
                    ): (
                    <div style={{position: "relative", marginTop: "3rem", left: "0.5rem"}}>
                    <Table responsive="xl" hover bordered variant="dark">
                        <thead>
                            <tr>
                                <th>
                                    Message ID
                                </th>
                                <th>Message Body</th>
                                <th>Message Author</th>
                                <th>Message Timestamp</th>
                            </tr>
                        </thead>
                        <tbody>
                            {thread.list_of_messages.map((message) => (
                                <tr key={`thread-${threadID}-msg-${message.id}`}>
                                    <td>{message.id}</td>
                                    <td>{message.body}</td>
                                    <td>{message.author}</td>
                                    <td>{date2(message.timestamp)}</td>
                                </tr>
                            )) }
                        </tbody>
                    </Table>
                    </div>
                    )}
                </Form>
            )}
        </Container>
    )
}
export default EditThread