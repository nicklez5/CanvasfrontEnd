// src/components/CoursesGrid.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreActions, useStoreState } from "easy-peasy";
import CourseCard from "./CourseCard";
import CreateCourseCard from "./CreateCourseCard";
import styles from "./modules/Courses.module.css"
const CoursesGrid = () => {
  const navigate     = useNavigate();
  const fetchCourses = useStoreActions((a) => a.courseStore.fetchCourses);
  const courses      = useStoreState((s) => s.courseStore.courses);
  const {user} = useStoreState((s) => s.userStore)
  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Example: pick a background variant based on course ID or index
  const pickVariant = (index) => {
    const variants = ["primary", "secondary", "danger", "default"];
    return variants[index % variants.length];
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.h1}>All Courses</h2>
      <div className="row gx-3 gy-3">
        {user.is_staff && (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <CreateCourseCard />
          </div>
        )}
        {courses.length === 0 && (
          <div className="col-12 text-center text-muted">
            No courses to display.
          </div>
        )}

        {courses.map((course, idx) => (
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
  );
};

export default CoursesGrid;
