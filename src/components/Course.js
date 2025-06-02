import {React, useEffect,useState} from 'react'
import {Link} from 'react-router-dom'
import { useStoreActions } from 'easy-peasy'
import useAxiosFetch from '../hooks/useAxiosFetch';
const Course = ({course}) => {

  return (

    <article className="course">
        
        <Link to={`/courses/${course.id}`} state={{ course }}>
            <h2 style={{color: "white" ,textDecoration: "none" }}>{course.name}</h2>
        </Link>
    </article>

  )
}

export default Course