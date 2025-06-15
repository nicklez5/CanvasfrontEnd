import React from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { useParams,Link } from 'react-router-dom';
import { useState } from 'react';
const NewMessage = () => {
    const {courseID, threadID} = useParams()
    const getCoursesById = useStoreState((state) => state.courseStore.getCoursesById)
    const course = getCoursesById(courseID)
    const createMessage = useStoreActions((actions) => actions.messageStore.createMessage)
    const {addMessageToThread} = useStoreActions((actions) => actions.courseStore)
    const fetchCourseDetails = useStoreActions((actions) => actions.courseStore.fetchCourseDetails)
    const [body, setBody] = useState('')
    const navigate = useNavigate()
    const handleSubmit = async(e) => {
        e.preventDefault();
        const newMessage = {body: body}
        try{
            await createMessage({threadId: threadID, messageData: newMessage, courseId: courseID, courseStoreActions : {  addMessageToThread}})
            fetchCourseDetails(courseID)
            navigate(`/courses/${courseID}`)
        }catch(error){
            console.error("Error creating the message:", error)
        }
    }
  return (
     <div className="NewMessage">
      <h2>
        New Message for Thread ID: {threadID} in "{course?.name}"
      </h2>

      <form style={{display: "flex", flexDirection:"column"}} onSubmit={handleSubmit}>
        <div style={{marginTop: "23px", paddingBottom: "15px"}}>
            <label htmlFor="postBody" style={{position: "relative", left: "175px",fontWeight: "bolder", fontSize: "25px", bottom: "45px", fontFamily: "Courier New', Courier, monospace"}}>Message Body</label>
            <textarea
                style={{textAlign: "center",position: "relative",padding: "10px", marginLeft: "5px",paddingRight: "100px",left: "5px"}}
                id="postBody"
                className="form-control"
                rows="10" 
                cols="50"
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Enter your message here"
            ></textarea>
            </div>

        <button type="submit" className="submitBtn" style={{marginLeft: "60px" }}>
          Submit
        </button>
      </form>
    </div>
  )
}

export default NewMessage