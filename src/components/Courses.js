import React from 'react'
import CoursesFeed from './CoursesFeed'
import { useStoreState } from 'easy-peasy'
const Courses = ({isLoading, fetchError}) => {
  const coursesResults = useStoreState((state) => state.coursesStore.courses)
  return (
    <>
    <h1 className="All_Courses">All Courses</h1>
    <main className="Courses">
        
        {isLoading && <p className="statusMsg">Loading courses...</p>}
        {!isLoading && fetchError && <p className="statusMsg" style={{color: "red"}}>{fetchError}</p>}
        {!isLoading && !fetchError && (coursesResults.length ? <CoursesFeed courses={coursesResults} /> : <p className="statusMsg">No courses to display</p>)}
    </main>
    </>
  )
}

export default Courses