import React, {useEffect} from 'react'
import { useStoreState, useStoreActions } from 'easy-peasy'
import CoursesFeed from './CoursesFeed'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from '../modules/UserCourses.module.css'
import CourseCard from './CourseCard'
const UserCourses = () => {
  const navigate = useNavigate();
  const fetchCourses = useStoreActions((actions) => actions.courseStore.fetchCourses);
  const allCourses = useStoreState((state) => state.courseStore.courses);
  // ② the user’s enrolled‐courses list (canvas)
  const canvas = useStoreState((state) => state.userStore.canvas.list_courses);

   useEffect(() => {
      fetchCourses()
  },[fetchCourses])
  const pickVariant = (index) => {
    const variants = ["primary", "secondary", "danger", "default"];
    return variants[index % variants.length];
  };
  const enrolled = allCourses.filter((course) =>
    canvas.some((c) => c.id === course.id)
  );
  return (
    <div className={styles.container}>
    <h1 className={styles.h1}>User Courses</h1>
    <div className="row gx-3 gy-3">
    {enrolled.length === 0 &&  (
      <div className="col-12 text-center text-muted">
        Not Enrolled in any Courses
      </div>
    )}
    {enrolled.map((course,idx) => (
      <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={course.id}>
        <CourseCard
          course={course}
          bgVariant={pickVariant(idx)}
          onClick={() => navigate(`/courses/${course.id}`)}
          onViewGrades={() => navigate(`/courses/${course.id}/grades`)}
          />
      </div>
    ))}
    </div>
    </div>
  )
}

export default UserCourses