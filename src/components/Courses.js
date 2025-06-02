import React, {useEffect} from 'react'
import CoursesFeed from './CoursesFeed'
import { useLocation } from 'react-router-dom';
import { useStoreActions, useStoreState } from 'easy-peasy'
import NewCourse from './NewCourse'
import { Link } from 'react-router-dom'
const Courses = ({isLoading, fetchError}) => {
  const location = useLocation()
  const {user} = useStoreState((state) => state.userStore)
  const fetchCourses = useStoreActions((actions) => actions.courseStore.fetchCourses)
  const coursesResults = useStoreState((state) => state.courseStore.courses)
  useEffect(() => {
    fetchCourses()
  },[fetchCourses])
  return (
    <>
    <h1 class="position-relative modal-title mb-5 mt-5">All Courses</h1>
    <main className="Courses">
        
        {isLoading && <p className="statusMsg">Loading courses...</p>}
        {!isLoading && fetchError && <p className="statusMsg" style={{color: "red"}}>{fetchError}</p>}
        {!isLoading && !fetchError && (coursesResults.length ? <CoursesFeed courses={coursesResults} /> : <p>No courses</p>)}
        {(user.is_staff ? <div className="create-course"><Link to="/postCourse" style={{color: "white"}}><h2 style={{top: "5px", position: "relative"}}>Create Course</h2></Link></div> : <p></p>)}
    </main>
    </>
  )
}

export default Courses