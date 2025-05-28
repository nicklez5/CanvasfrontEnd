import axios from 'axios';
import { createStore, action, persist ,thunk, computed} from 'easy-peasy';
import api from "../api/courses"
import { PiAlignCenterHorizontalSimple } from 'react-icons/pi';
import AsyncStorage from '@react-native-async-storage/async-storage'
const coursesStore = { 
    courses : [],
    loading: false,
    error: null,
    setCourses: action((state,payload ) => {
        state.courses = payload
    })
    ,fetchCourses: thunk(async(actions) => {
        actions.setLoading(true)
        try{
            const response = await api.get(`/courses/`,)
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            actions.setCourses(response.data);
            actions.setError(null)
            return response.data
        }catch(err){actions.setError(err.message)}
        finally{
            actions.setLoading(false)
        }
    }),
    setLoading: action((state, payload) => {
        state.loading = payload;
    }),
    setError: action((state, payload) => {
        state.error = payload;
    }),
    getCoursesById: computed ((state) => {
        return(id) => 
             state.courses.find(course => (course.id).toString() === id);
             
    }),
    addCourse: action((state,course123) => {
        state.courses.push(course123)
    }),
    deleteCourse: action((state,courseID) => {
        state.courses = state.courses.filter(a => a.id !== courseID)
    })
    
}
const courseStore = { course : {
    id: '',
    name: "",
    assignments:[],
    lectures: [],
    profiles: [],
    tests: [],
    threads: [],
    },
    loading: false,
    error: null,
    setCourse: action((state,payload) => {
        state.course = payload
    }),
    fetchCourse: thunk(async(actions, courseID) => {
        actions.setLoading(true)
        try{
            const response = await api.get(`/courses/detail/${courseID}/`,{
                    headers: {'Authorization':`Token ${localStorage.getItem('token')}` }}
            )
            actions.setCourse(response.data)
            actions.setError(null)
        }catch(error){
            actions.setError(error.message)
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
    updateCourseName: thunk(async (actions, {id , updatedData}, helpers) => {
        actions.setLoading(true)
        try{
            const response = await api.put(`/courses/edit/${id}/`,updatedData,{
            headers: {
                'Authorization':`Token ${localStorage.getItem('token')}`
            }});
            actions.setCourses(response.data);
        }catch(err){
            console.log(`Error: ${err.message}`)
        }finally{
            actions.setLoading(false)
        }
        }),
    // Optional: Update assignment
    updateAssignment: thunk(async (actions, { id, updatedData }) => {
        const formData = new FormData();
        formData.append("id", updatedData.id)
        formData.append('file',updatedData.file)
        formData.append("name",updatedData.name)
        formData.append("date_due",updatedData.date_due)
        formData.append("description",updatedData.description)
        formData.append("max_points",updatedData.max_points)
        formData.append("student_points",updatedData.student_points)
        formData.append("submitter",updatedData.submitter)
        actions.setLoading(true);
        try {
            const response = await api.post(`/assignments/edit/${id}/`, formData)
            actions.setAssignment(response.data);
        } catch (err) {
            actions.setError(err.message);
        } finally {
            actions.setLoading(false);
        }
    }),
    updateAssignmentInCourse: action((state, { courseId, updatedAssignment }) => {
    const courseIndex = state.courses.findIndex(course => course.id === courseId);
    if (courseIndex !== -1) {
        const assignmentIndex = state.courses[courseIndex].assignments.findIndex(
            a => a.id === updatedAssignment.id
        );
        if (assignmentIndex !== -1) {
            state.courses[courseIndex].assignments[assignmentIndex] = updatedAssignment;
        }
    }
}),

}
const lectureStore = {
    id: "",
    lecture: null,
    loading: false,
    error: null,
    setLecture: action((state,payload) => {
        state.lecture = payload
    }),
    fetchLecture: thunk(async(actions, lectureID) => {
        actions.setLoading(true)
        try{
            const response = await api.get(`/lecture/detail/${lectureID}/`,{
                    headers: {'Authorization':`Token ${localStorage.getItem('token')}` }}
            )
            const data = await response.json()
            actions.setLecture(data)
            actions.setError(null)
        }catch(error){
            actions.setError(error.message)
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
}

// Your axios instance

const messageStore = { message: {
    id: "",
    author: "",
    description: '',
    timestamp: ''
},
    loading: false,
    error: null,
    setMessage:action((state,payload) => {
        state.message = payload
    }),
    fetchMessage: thunk(async(actions, messageID ) => {
        actions.setLoading(true)
        try{
            const response = await api.get(`/messages/detail/${messageID}/`,{
                    headers: {'Authorization':`Token ${localStorage.getItem('token')}` }}
            )
            if(!response.ok){
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            actions.setMessage(response.data)
            actions.setError(null)
        }catch(error){
            actions.setError(error.message)
        }finally{
            actions.setLoading(false)
        }

    }),
    setLoading: action((state,payload) => {
        state.loading = payload;
    }),
    setError: action((state,payload) => {
        state.error = payload
    })
}
const canvasStore = { 
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
            const response = await api.get(`/canvas/detail/${studentID}/`,{
                    headers: {'Authorization':`Token ${localStorage.getItem('token')}` }}
            )
            const data = response.data
            actions.setCanvas(data)
            actions.setError(null)
            return data
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
    
}
const profileStore = { 
    profile: {
        pk: 0,
        first_name: "",
        last_name: "",
        date_of_birth: ""
    },
    loading: false,
    error: null,
    setProfile: action((state,payload) => {
        state.profile = payload
    }),
    fetchProfile: thunk(async ( actions, profileID) => {
        actions.setLoading(true)
        try{ 
            const response = await api.get(`/profiles/${profileID}/`, {
                headers: {'Authorization':`Token ${localStorage.getItem('token')}`}})
                
        actions.setProfile(response.data)
        actions.setError(null)
        }catch(error){
            actions.setError(error.message)
        }finally{
            actions.setLoading(false)
        }
    }),
    updateProfile: thunk(async(actions,updatedProfile) => {
        
        actions.setLoading(true)
        try{
            const response = await api.put(`/profiles/update/${localStorage.getItem("pk")}/`,updatedProfile,{
                headers: {'Authorization':`Token ${localStorage.getItem('token')}`}
            })
            actions.setProfile
        }
    })
    setLoading: action((state, payload) => {
        state.loading = payload;
    }),
    setError: action((state, payload) => {
        state.error = payload;
    }),
}

const threadStore = { 
    thread : {
        id: "",
        list_messages: [],
        title: '',
        created_at: "",

    }, 
    loading: false,
    error:null,
    setThread: action((state,payload) => {
        state.thread = payload
    }),
    resetThread: action((state) => {
        state.thread.id = '';
        state.thread.list_messages = [];
        state.thread.title = "";
        state.thread.created_at = ""
    }),
    
    deleteThread: thunk(async(actions,threadID) => {
        actions.setLoading(true)
        try{
            const response = await api.delete(`/threads/delete/${threadID}/`,{
                    headers: {'Authorization':`Token ${localStorage.getItem('token')}` }}
            )
            if(response.data['response'] === 'Delete success'){
                actions.resetThread()
            }

            actions.setError(null)
        }catch(error){
            actions.setError(error.message)
        }finally{
            actions.setLoading(false)
        }
    }),
    fetchThread: thunk(async(actions, threadID) => {
        actions.setLoading(true)
        try{
            const response = await api.get(`/threads/detail/${threadID}/`,{
                    headers: {'Authorization':`Token ${localStorage.getItem('token')}` }}
            )
            actions.setThread(response.data)
            actions.setError(null)
        }catch(error){
            actions.setError(error.message)
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
    addMessages: thunk(async(actions,{threadID,messageBody}) => {
        const data = {
            body: messageBody
        }
        actions.setLoading(true)
        try{
            const response = await api.post(`/threads/add/${threadID}/messages/`,data)
            actions.setThread(response.data)
            actions.setError(null)
        }catch(err){
            console.log(`Error: ${err.message}`)
        }finally{
            actions.setLoading(false)
        }
    }),
    deleteMessages: thunk(async(actions, [threadID,messageID]) => {
        actions.setLoading(true)
        try{
            const response = await api.delete(`/threads/delete/${threadID}/messages/${messageID}/`)
            actions.setThread(response.data)
            actions.setError(null)
        }catch(err){
            console.log(`Error: ${err.message}`)
        }finally{
            actions.setLoading(false)
        }
    })
    
}
const userStore = { 
    user: {
        username: "",
        email: "",
        pk: "",
        is_staff: false
    },
    loading: false,
    error: null,
    setUser: action((state,payload) => {
        state.user = payload
    }),
    fetchUser: thunk(async(actions,credentials) => {
        actions.setLoading(true)
        try{
            const response = await api.post(`/users/login/`,credentials)
            const { token, user_id} = response.data
            
            localStorage.setItem("token", token)
            localStorage.setItem("pk", user_id)
            const response2 = await api.get(`/users/detail/${user_id}/`, {
                headers: {
                'Authorization':`Token ${localStorage.getItem('token')}`
                }
            })
            actions.setUser(response2.data);
            actions.setError(null)
            return response2.data
        }catch(error){
            actions.setError(error.message)
        }finally{
            actions.setLoading(false)
        }
    }),
    setLoading: action((state, payload) => {
        state.loading = payload;
    }),
    setError: action((state, payload) => {
        state.error = payload;
    })

}
const store = createStore({
    userStore: persist(userStore, {
        storage: AsyncStorage,
        key: "userStore"
    }),
    coursesStore: persist(coursesStore, {
        storage: AsyncStorage,
        key: "coursesStore"
    }),
    courseStore: persist(courseStore, {
        storage: AsyncStorage,
        key: "courseStore"
    }),
    lectureStore: persist(lectureStore, {
        storage: AsyncStorage,
        key: "lectureStore"
    }),
    assignmentStore: persist(assignmentStore, {
        storage: AsyncStorage,
        key: "assignmentStore"
    }),
    messageStore: persist(messageStore, {
        storage: AsyncStorage,
        key: "messageStore"
    }),
    canvasStore: persist(canvasStore , {
        storage: AsyncStorage,
        key: "canvasStore"
    }),
    profileStore: persist(profileStore, {
        storage: AsyncStorage,
        key: "profileStore"
    }),
    threadStore: persist(threadStore, {
        storage: AsyncStorage,
        key: "threadStore"
    })
    
})
export default store