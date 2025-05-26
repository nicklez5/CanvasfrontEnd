import React from 'react'
import { useStoreState } from 'easy-peasy'
import CoursesFeed from './CoursesFeed'
import { useLocation } from 'react-router-dom'
const UserCourses = ({isLoading,fetchError}) => {
  const coursesResults = useStoreState((state) => state.canvasStore.canvas.list_courses)
  return (
    <>
    <h1 className="All_Courses">Courses</h1>
    <main className="Courses">
        {isLoading && <p className="statusMsg">Loading courses...</p>}
        {!isLoading && fetchError && <p className="statusMsg" style={{color: "red"}}>{fetchError}</p>}
         {!isLoading && !fetchError && (coursesResults.length ? <CoursesFeed courses={coursesResults} /> : <p className="statusMsg">No courses to display</p>)}
    </main>
    </>
  )
}

export default UserCourses