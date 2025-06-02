import {React, useEffect, useState} from 'react'
import { useStoreActions, useStoreState } from 'easy-peasy'
import useAxiosFetch from '../hooks/useAxiosFetch'
import { useNavigate,Link } from 'react-router-dom'
import {api} from "./../api/courses"
const Home = () => {
  const id = localStorage.getItem("pk")
  const {canvas,user} = useStoreState((state) => state.userStore)
  const { loading, error} = useStoreState((state) => state.userStore)
  
  
  useEffect(() => {
    const fetchData = async() => {
      try{
        const {list_courses} = canvas.list_courses  
        console.log(list_courses)
      }catch(error) {
        console.error("Error fetching canvas courses:", error);
      }
    }
     if (id) {
    fetchData();
  }
}, [canvas.list_courses,id]);
    
    return (
        <article className="HomeCourses">
            <main className="homecourse">
            <div className="Home_Courses"><Link to="/UserCourses" state = {{
                fetchError: error,
                isLoading: loading
            }}>Enrolled Courses</Link></div>
            <div className="Home_Tests"><Link to="/courses"  style={{color: "white"}} >Browse Courses</Link></div>
            <div className="Home_Settings"><Link to="/Profile" style={{color: "white"}}>Profile</Link></div>
            <div className="Home_Threads"><Link to="/UserSettings" style={{color: "white"}}>User Settings</Link></div>


        </main>
        </article>
        
  )
}

export default Home