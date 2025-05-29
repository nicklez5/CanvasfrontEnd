import React from 'react'
import CoursesFeed from './CoursesFeed'
import { useStoreState } from 'easy-peasy'
import NewCourse from './NewCourse'
import { Link } from 'react-router-dom'
const Courses = ({isLoading, fetchError}) => {
  const coursesResults = useStoreState((state) => state.courseStore.courses)
  return (
    <>
    <h1 className="All_Courses">All Courses</h1>
    <main className="Courses">
        
        {isLoading && <p className="statusMsg">Loading courses...</p>}
        {!isLoading && fetchError && <p className="statusMsg" style={{color: "red"}}>{fetchError}</p>}
        {!isLoading && !fetchError && (coursesResults.length ? <CoursesFeed courses={coursesResults} /> : <div className="create-course"><Link to="/postCourse" style={{color: "white"}}>Create a Course</Link></div>)}
    </main>
    </>
  )
}

export default Courses