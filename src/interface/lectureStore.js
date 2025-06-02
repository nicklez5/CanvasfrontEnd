import axios from 'axios';
import { createStore, action, persist ,thunk, computed} from 'easy-peasy';
import api from "../api/courses"
import { PiAlignCenterHorizontalSimple } from 'react-icons/pi';
export const lectureStore = { lecture : {
    id: 0,
    description: '',
    name: '',
    file: ''
},
    loading: false,
    error: null,
    setLecture: action((state,payload) => {
        state.lecture = payload
    }),
    fetchLecture: thunk(async(actions, lectureID) => {
        actions.setLoading(true)
        try{
            const response = await api.get(`/lectures/detail/${lectureID}/`)
            actions.setLecture(response.data)
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
    // Optional: Update assignment
    updateLecture: thunk(async (actions, { updatedData, id , courseStoreActions }) => {
        const formData = new FormData();
        if(updatedData.file !== null){
            formData.append('file',updatedData.file)
        }
        formData.append("name",updatedData.name)
        formData.append("description",updatedData.description)
        actions.setLoading(true);
        try {
            const response = await api.put(`/lectures/update/${updatedData.id}/`, formData)
            actions.setLecture(response.data);
            courseStoreActions.updateLectureInCourse({
            courseId: id,   // Pass course_id to ensure it updates the correct course
            updatedLecture: response.data,
        });
            actions.setError(null);
            return { success: true };
        } catch (err) {
            actions.setError(err.message);
            console.error("Failed to update lecture:", err);
            return { success: false, error: err.response?.data || err.message };
        } finally {
            actions.setLoading(false);
        }
    }),
    createLecture: thunk(async (actions, { LectureData, id, courseStoreActions }) => {
        const formData = new FormData();
        formData.append('file', LectureData.file);
        formData.append('name', LectureData.name);
        formData.append('description', LectureData.description);

        actions.setLoading(true);
        try {
            const response = await api.post(`/lectures/post/`, formData);
            const lecture = response.data;
            

            actions.setLecture(lecture);

            const linkData = { id: lecture.id };
            await api.post(`/courses/lectures/${id}/`, linkData);

            if (courseStoreActions && courseStoreActions.addLectureInCourse) {
            courseStoreActions.addLectureInCourse({
                courseId: id,
                updatedLecture: lecture,
            });
        }

            actions.setError(null);
        } catch (err) {
            actions.setError(err.message || "Unknown error");
        } finally {
            actions.setLoading(false);
        }
        }),

    deleteLecture: thunk(async(actions,{lectureID}) => {
        actions.setLoading(true);
        try {
          await api.delete(`/lectures/delete/${lectureID}/`);
          actions.setLecture({});
           // Reset the Lecture state after deletion
    
          actions.setError(null);
          return true
        }catch(error){
            console.error("Error deleting the lecture:", error);
            actions.setError(error.message|| "Failed to delete lecture")
            return false
        }finally{
            actions.setLoading(false)
        }
    })
}