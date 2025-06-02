import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { useStoreState, useStoreActions } from 'easy-peasy'
import { useParams,Link } from 'react-router-dom';
import { useState } from 'react';
const NewTest = () => {
    const {courseID} = useParams() 
    const createTest = useStoreActions((actions) => actions.testStore.createTest)

    const  {addTestInCourse} = useStoreActions((actions) => actions.courseStore)
    const {fetchCourseDetails} = useStoreActions((actions) => actions.courseStore)
    const navigate = useNavigate()
    const [test_file, setTestFile] = useState(null)
    const [name, setName] = useState('')
    const [date_due, setDateDue] = useState('')
    const [description, setDescription] = useState('')
    const [max_points, setMaxPoints] = useState('')
    const handleSubmit = async(e) => {
        e.preventDefault();
        
        const formatDate = (date) => {
            const year = date.getFullYear()
            const month = String(date.getMonth() + 1).padStart(2,'0')
            const day =  String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}`
        }
        const datetime = formatDate(new Date(date_due))
        const newTest = {name: name, description: description, date_due: datetime, test_file: test_file, max_points: max_points }
        try{
            await createTest({testData: newTest, id: courseID, courseStoreActions: {addTestInCourse}})
            fetchCourseDetails(courseID);
            navigate(`/courses/${courseID}`)
        }catch(error){
            console.error("Error creating the Assignment:",error)
        }

    }
  return (
    <div className = "NewTest">
            <h2>New Test</h2>
            <form className="newPostForm" style={{display: "flex", flexDirection:"column"}} onSubmit={handleSubmit}>
                <div style={{marginTop: "23px", paddingBottom: "15px"}}>
                <label htmlFor="postName" style={{position: "relative", left: "25px",fontWeight: "bolder"}}>Test Name:</label>
                <input
                    style={{position: "relative",padding: "10px", marginLeft: "25px",paddingRight: "160px",left: "55px"}}
                    id="postName"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                </div>
                <div style={{marginTop: "15px", paddingBottom: "15px"}}>
                <label htmlFor="postDate" style={{position: "relative", left: "15px",bottom: "-5px",fontWeight: "bolder"}}>Test Due Date:</label>
                <input 
                    style={{textAlign: "center",position: "relative",padding: "10px", marginLeft: "15px",paddingRight: "120px",left: "40px"}}
                    id="postDate"
                    type="datetime-local"
                    required
                    value={date_due}
                    onChange={(e) => setDateDue(e.target.value)}
                />
                </div>
                <div style={{marginTop: "15px", paddingBottom: "15px"}}>
                <label htmlFor="postDescription" style={{position: "relative", left: "1px",bottom: "95px",fontWeight: "bolder"}}>Test Description:</label>
                <textarea
                     style={{position: "relative",padding: "10px", marginLeft: "15px",paddingRight: "100px",left: "20px"}}
                    rows="10" 
                    cols="50"
                    id="postDescription"
                    type="text"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                </div>
                <div tyle={{marginTop: "15px", paddingBottom: "15px"}}>
                <label htmlFor="postMaxPoints" style={{position: "relative", left: "2px",fontWeight: "bolder"}}>Test Max Points</label>
                <input 
                    style={{position: "relative",padding: "10px",marginLeft: "25px",paddingRight: "20px", left: "15px"}}
                    id="postMaxPoints"
                    type="number"
                    required
                    value={max_points}
                    onChange={(e) => setMaxPoints(e.target.value)}
                    />
                </div>
                <div style={{marginTop: "15px", paddingBottom: "15px"}}>
                <label htmlFor="postFile" style={{position: "relative", left: "55px",fontWeight: "bolder"}}>Test File</label>
                <input 
                    style={{position: "relative",padding: "40px",marginLeft: "15px",paddingRight: "150px", left: "50px"}}
                    id="postFile"
                    type="file"
                    onChange={(e) => setTestFile(e.target.files[0])}
                    />
                </div>
                <button type="submit" className="submitBtn" style={{marginLeft: "120px" }}>Submit</button>
            </form>
        </div>
  )
}

export default NewTest