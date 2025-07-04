import axios from 'axios';
import { createStore, action, persist ,thunk, computed} from 'easy-peasy';
import api from "../api/courses"
export const threadStore = { 
    thread : {
        id: 0,
        list_of_messages: [],
        title: '',
        created_at: "",
        author: ""

    }, 
    loading: false,
    error:null,
    setThread: action((state,payload) => {
        state.thread = payload
    }),
    
 
    deleteThread: thunk(async(actions,{id, threadID,courseStoreActions}) => {
        actions.setLoading(true)
        try{
            courseStoreActions.removeThreadFromCourse({
                    courseId: id,
                    threadId: threadID
            })
            await api.delete(`/threads/delete/${threadID}/`) 
            actions.setThread({})
            actions.setError(null)
            return true
        }catch(error){
            actions.setError(error.message)
            console.log("Error:",error.message)
            return false
        }finally{
            actions.setLoading(false)
        }
    }),
    createThread: thunk(async(actions,{threadData,id,courseStoreActions}) => {
        const formData = new FormData();
        formData.append("title", threadData.title)
        actions.setLoading(true)
        try{
            const response = await api.post(`/threads/post/`,formData)
            actions.setThread(response.data)
            const addToCourseFormData = new FormData();
            addToCourseFormData.append('id', response.data.id);
            await api.post(`/courses/threads/${id}/`, addToCourseFormData);
            courseStoreActions.addThreadInCourse({
                courseId: id,
                updatedThread: response.data
            })
            actions.setError(null)
            return { success: true };
        }catch(err){
            actions.setError(err.message)
            console.error("Failed to create Thread:", err);
            return { success: false, error: err.response?.data || err.message };
        }finally{
            actions.setLoading(false)
        }
    }),
    updateThread: thunk(async(actions, {updatedData, course_id, courseStoreActions}) => {
        const formData = new FormData()
        formData.append("title",updatedData.title)
        actions.setLoading(true);
        try{
            const response = await api.put(`/threads/update/${updatedData.id}/`,formData)
            actions.setThread(response.data)
            courseStoreActions.updateThreadInCourse({
                course_id,
                updatedThread: response.data
            })
            actions.setError(null)
            return { success: true };
        }catch(err){
            actions.setError(err.message);
            console.error("Failed to update Thread:", err);
            return { success: false, error: err.response?.data || err.message };
        }finally{
            actions.setLoading(false)
        }
    }),
    fetchThread: thunk(async(actions, threadID) => {
        actions.setLoading(true)
        try{
            const response = await api.get(`/threads/detail/${threadID}/`)
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
    reset: action((state,payload) => {
        state.thread = payload
        state.error = null
        state.loading = false
        // Return a copy of the initial state
    }),
    // addMessages: thunk(async(actions,{threadID,messageBody, courseID, courseStoreActions}) => {
    //     const formData = new FormData()
    //     formData.append('body',messageBody)
    //     actions.setLoading(true)
    //     try{
    //         const response = await api.post(`/threads/add/${threadID}/messages/`,formData)
    //         courseStoreActions.addMessageToThread({
    //             courseId: courseID,         // Course ID to ensure it updates the correct course
    //             threadId: threadID,         // The thread where the message belongs
    //             message: response.data,     // The new message data returned from the API
    //         });
    //         actions.setError(null)
    //     }catch(err){
    //         console.log(`Error: ${err.message}`)
    //         actions.setError(`Failed to add message: ${err.message}`);
    //     }finally{
    //         actions.setLoading(false)
    //     }
    // }),
    // deleteMessages: thunk(async(actions, {threadID,messageID, courseID, courseStoreActions}) => {
    //     actions.setLoading(true)
    //     try{
    //         const response = await api.delete(`/threads/delete/${threadID}/messages/${messageID}/`)
    //         courseStoreActions.removeMessageFromThread({
    //             courseId: courseID, 
    //             threadId: threadID,  // Pass course_id to ensure it updates the correct course
    //             message: response.data,
    //         });
    //         actions.setError(null)
    //     }catch(err){
    //         console.log(`Error: ${err.message}`)
    //         actions.setError(`Failed to delete message: ${err.message}`);
    //     }finally{
    //         actions.setLoading(false)
    //     }
    // }),
    // updateMessages: thunk(async(actions, {threadID,messageID,messageBody,courseID, courseStoreActions}) => {
    //     const data = {
    //         body: messageBody
    //     }
    //     actions.setLoading(true)
    //     try{
    //         const response = await api.patch(`/threads/update/${threadID}/messages/${messageID}/`,data)
    //         actions.setThread(response.data)
    //         courseStoreActions.updateThreadsInCourse({
    //             courseId: courseID,   // Pass course_id to ensure it updates the correct course
    //             updatedThread: response.data,
    //         });
    //         actions.setError(null)
    //     }catch(err){
    //         console.log(`Error: ${err.message}`)
    //         actions.setError(`Failed to update message: ${err.message}`);
    //     }finally{
    //         actions.setLoading(false)
    //     }
    // }),
    
}