import { useEffect,useState} from 'react';
import { useParams,Link } from 'react-router-dom';
import { useStoreState, useStoreActions, useStore } from 'easy-peasy'
import {format} from 'date-fns'
import { useNavigate } from 'react-router-dom';

const Course = () => {
  const { id} = useParams();
  const navigate = useNavigate();
  const editCourse = useStoreActions((actions) => actions.editCourse)
  const editCourseName = useStoreState((state) => state.editCourseName)
  const courseAssignments = useStoreState((state) => state.courseAssignments)
  const courseLectures = useStoreState((state) => state.courseLectures)
  const coursesProfiles = useStoreState((state) => state.coursesProfiles)
  const coursesTests = useStoreState((state) => state.coursesTests)
  const coursesThreads = useStoreState((state) => state.coursesThreads)
  const setEditCourseName = useStoreActions((actions) => actions.setEditCourseName)
  const setCoursesAssignments = useStoreActions((actions) => actions.setCoursesAssignments)
  const setCoursesLectures = useStoreActions((actions) => actions.setCoursesLectures)
  const setCoursesProfiles = useStoreActions((actions) => actions.setCoursesProfiles)
  const setCoursesTests = useStoreActions((actions) => actions.setCoursesTests)
  const setCoursesThreads = useStoreActions((actions) => actions.setCoursesThreads)
  const getCoursesById = useStoreState((state) => state.getCoursesById)
  const course = getCoursesById(id)
  
  useEffect(() => {
    if(course){
        setEditCourseName(course.name);
        setCoursesAssignments(course.assignments)
        setCoursesLectures(course.lectures)
        setCoursesProfiles(course.profiles)
        setCoursesTests(course.tests)
        setCoursesThreads(course.threads)
    }
  },[course,setEditCourseName,setCoursesAssignments,setCoursesLectures,setCoursesProfiles,setCoursesTests,setCoursesThreads])
  const handleEdit = async(id) => {
    const updatedCourse = {id,
    name: editCourseName,
    assignments: courseAssignments,
    lectures: courseLectures,
    profiles: coursesProfiles,
    tests: coursesTests,
    threads: coursesThreads,
  }
   await editCourse(updatedCourse)
   navigate(`/courses/${id}`)
} 
 
 const handleAssignmentChange = (event) => {
    setCoursesAssignments([event.target.value])
 }  
  const handleLectureChange = (event) => {
    setCoursesLectures([event.target.value])
 }  
  const handleProfileChange = (event) => {
    setCoursesProfiles([event.target.value])
 }  
  const handleTestChange = (event) => {
    setCoursesTests([event.target.value])
 }  
  const handleThreadChange = (event) => {

    setCoursesThreads([event.target.value])
 }  

 
 
  return (
    <main className="New Course">
        {editCourseName && 
            <>
                <h2> Course</h2>
                <form className="newCourseForm" onSubmit={(e) => e.preventDefault()}>
                    <label htmlFor="postCourseName">Course Name</label>
                    <input
                        id="postCourseName"
                        type="text"
                        required
                        value={course.name}
                        onChange={(e)=>setEditCourseName(e.target.value)}
                    />
                    <br/>
                    <label htmlFor="postCourseLectures">Course Assignments:</label>
                    <select onChange={handleAssignmentChange}>
                    {course.assignments.map((assignment) => {
                        return (
                            
                            <option key={assignment.id} value={assignment} multiple="multiple">
                                {assignment.name}
                            </option>
                            
                        )})}
                        </select>
                        <br/>
                    <label htmlFor="postCourseLectures">Course Lectures:</label>
                    <select  onChange={handleLectureChange}>
                    {course.lectures.map((lecture) => {
                        return (
                            
                            <option key={lecture.id} value={lecture} multiple="multiple">
                                {lecture.name}
                            </option>
        
                        )})}
                        </select>
                        <br/>
                    <label htmlFor="postCourseProfiles">Course Profiles:</label>
                    <select  onChange={handleProfileChange}>
                    {course.profiles.map((profile) => {
                        return (
                            
                            <option key={profile.pk} value={profile} multiple="multiple">
                                {profile.first_name + " " + profile.last_name}
                            </option>
                            
                        )})}
                        </select>
                        <br/>
                    <label htmlFor="postCourseTests">Course Tests:</label>
                    <select onChange={handleTestChange}>
                    {course.tests.map((test) => {
                        return (
                            
                            <option key={test.test_id} value={test} multiple="multiple">
                                {test.name}
                            </option>
                            
                        )})}
                        </select>
                        <br/>
                    <label htmlFor="postCourseThreads">Course Threads:</label>
                    <select onChange={handleThreadChange}>
                    {course.threads.map((thread) => {
                        
                            return (
                            <option key={thread.thread_id} value={thread} multiple="multiple">
                                {thread.last_description}
                            </option>
                            
                        )})}
                        </select>
                    <button type="submit" onClick={() => handleEdit(course.id)}>Submit</button>
                </form>
            </>
        
        }
        {!editCourseName && 
            <>
                <h2>Course not found</h2>
                <p>Well, that's disappointing</p>
                <p>
                    <Link to='/'>Visit Our Homepage</Link>
                </p>  
            </>
            
            
        }
    </main>
  )
}

export default Course