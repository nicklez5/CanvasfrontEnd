import React from 'react'
import Course from './Course'
const CoursesFeed = ({courses}) => {
  return (
    <>
        {courses.map(course => (
            <Course key={course.id} course={course} />
        ))}
    </>
  )
}

export default CoursesFeed