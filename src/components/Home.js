import {React, useEffect, useState} from 'react'
import { useStoreActions, useStoreState } from 'easy-peasy'
import useAxiosFetch from '../hooks/useAxiosFetch'
import { useNavigate,Link } from 'react-router-dom'
import {api} from "./../api/courses"
const Home = () => {
  const id = localStorage.getItem("pk")
  const setCanvasCourses = useStoreActions((actions) => actions.setCanvasCourses)
  const {data,fetchError,isLoading} = useAxiosFetch(`http://localhost:8000/canvas/detail/${id}/`)
  useEffect(() => {
    setCanvasCourses(data.list_courses)
  },[setCanvasCourses,data.list_courses])
  
    return (
        <article className="HomeCourses">
            <main className="homecourse">
            <div className="Home_Courses"><Link to="/UserCourses" state = {{
                fetchError: fetchError,
                isLoading: isLoading
            }}>Enrolled Courses</Link></div>
            <div className="Home_Tests"><Link to="/Courses"  style={{color: "white"}} >Browse Courses</Link></div>
            <div className="Home_Threads">Threads</div>

            <div className="Home_Settings">Profile</div>
        </main>
        </article>
        
  )
}

export default Home