import React, {useEffect} from 'react'
import { useStoreState, useStoreActions } from 'easy-peasy'
import CoursesFeed from './CoursesFeed'
import { useLocation } from 'react-router-dom'
const UserCourses = ({isLoading,fetchError}) => {
  
  const fetchCourses = useStoreActions((actions) => actions.courseStore.fetchCourses);
  const allCourses = useStoreState((state) => state.courseStore.courses);
  // ② the user’s enrolled‐courses list (canvas)
  const canvas = useStoreState((state) => state.userStore.canvas.list_courses);

   useEffect(() => {
      fetchCourses()
  },[fetchCourses])
  const enrolled = allCourses.filter((course) =>
    canvas.some((c) => c.id === course.id)
  );
  return (
    <>
    <h1 class="position-relative modal-title mb-5 mt-5">Courses</h1>
    <main className="Courses">
        {isLoading && <p className="statusMsg">Loading courses...</p>}
        {!isLoading && fetchError && <p className="statusMsg" style={{color: "red"}}>{fetchError}</p>}
         {!isLoading && !fetchError && (enrolled.length ? <CoursesFeed courses={enrolled} /> : <p className="statusMsg">No courses to display</p>)}
    </main>
    </>
  )
}

export default UserCourses