import axios from 'axios';
import { createStore, action, persist ,thunk, computed} from 'easy-peasy';
import api from "../api/courses"

export const canvasStore = { 
    canvas: {
        list_courses: [],
        user: null
    },
    loading: false,
    error: null,
    setCanvas: action((state,payload) => {
        state.canvas = payload
    }),
    fetchCanvas: thunk(async(actions, studentID) => {
        actions.setLoading(true)
        try{
            const response = await api.get(`/canvas/detail/${studentID}/`)
            
            actions.setCanvas(response.data)
            actions.setError(null)
        }catch(error){
            actions.setError(error.message)
            throw error;
        }finally{
            actions.setLoading(false)
        }
    }),
    setLoading: action((state, payload) => {
        state.loading = payload;
    }),
    setError: action((state, payload) => {
        state.error = payload;
    }),
    removeCourse: thunk(async(actions, courseID) => {
        const data = {
            id: courseID
        }
        actions.setLoading(true)
        try{
            const response = await api.put(`/canvas/courses/${localStorage.getItem("pk")}/`, data)
            
            actions.setCanvas(response.data)
            actions.setError(null)
        }catch(error){
            actions.setError(error.message)
        }finally{
            actions.setLoading(false)
        }
    }),
    addCourse: thunk(async(actions, courseID) => {
        const data = {
            id: courseID
        }
        actions.setLoading(true)
        try{
            const response = await api.post(`/canvas/courses/${localStorage.getItem("pk")}/`,data)
            
            actions.setCanvas(response.data)
            actions.setError(null)
        }catch(error){
            actions.setError(error.message)
        }finally{
            actions.setLoading(false)
        }
    }),
    getCoursesById: computed ((state) => {
        return(id) => 
             state.canvas.list_courses.find(course => (course.id).toString() === id);
             
    }),
    
}