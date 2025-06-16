import axios from 'axios';
import { createStore, action, persist ,thunk, computed} from 'easy-peasy';
import api from "../api/courses"
export const testStore = { test : {
    id: 0,
    name: '',
    description: '',
    date_due : '',
    max_points: 0,
    test_file: '',
},
  loading: false,
  error: null,

  // Sets the current assignment object
  setTests: action((state, payload) => {
    state.test = payload;
  }),

  // Sets loading state
  setLoading: action((state, payload) => {
    state.loading = payload;
  }),

  // Sets error state
  setError: action((state, payload) => {
    state.error = payload;
  }),

  // Fetch assignment by ID from backend
  fetchTest: thunk(async (actions, testID) => {
    actions.setLoading(true);
    try {
      const response = await api.get(`/tests/detail/${testID}/`);
      actions.setTests(response.data);
      actions.setError(null);
    } catch (error) {
      actions.setError(error.message);
    } finally {
      actions.setLoading(false);
    }
  }),
  // Optional: Update assignment
  updateTest: thunk(async (actions, { updatedData, id , courseStoreActions }) => {
    const formData = new FormData();
    if(updatedData.test_file !== null){
        formData.append('test_file', updatedData.test_file);
    }
    formData.append("name",updatedData.name)
    formData.append("date_due",updatedData.date_due)
    formData.append("description",updatedData.description)
    formData.append("max_points",updatedData.max_points)
    actions.setLoading(true);
    try {
      const response = await api.put(`/tests/update/${updatedData.id}/`, formData)
      actions.setTests(response.data);
      courseStoreActions.updateTestInCourse({
        courseId: id,   // Pass course_id to ensure it updates the correct course
        updatedTest: response.data,
    });
      actions.setError(null);
      return { success: true };
    } catch (err) {
      actions.setError(err.message);
      console.error("Failed to update Test:", err);
      return { success: false, error: err.response?.data || err.message };
    } finally {
      actions.setLoading(false);
    }
  }),
  createTest: thunk(async(actions,{testData, id, courseStoreActions} ) => {
    const formData = new FormData();
    formData.append('test_file',testData.test_file)
    formData.append("name",testData.name)
    formData.append("date_due",testData.date_due)
    formData.append("description",testData.description)
    formData.append("max_points",testData.max_points)
    actions.setLoading(true);
    try {
      const response = await api.post(`/tests/post/`, formData)
      actions.setTests(response.data);
      const addToCourseFormData = new FormData();
      addToCourseFormData.append('id', response.data.id);
      await api.post(`/courses/tests/${id}/`, addToCourseFormData);
      courseStoreActions.addTestInCourse({
         courseID: id,
         updatedTest: response.data
      })
      actions.setError(null);
      return { success: true };
    } catch (err) {
      actions.setError(err.message);
      console.error("Failed to create Test:", err);
      return { success: false, error: err.response?.data || err.message };
    } finally {
      actions.setLoading(false);
    }
  }),
  deleteTest: thunk(async(actions,{id, testID,courseStoreActions}) => {
    actions.setLoading(true);
    try {
      courseStoreActions.removeTestFromCourse({
         courseId: id,
         testId: testID
      })
      await api.delete(`/tests/delete/${testID}/`);
     
      actions.setError(null);
       // Reset the test state after deletion
      return true
      
    }catch(error){
        console.log("error:" ,error.message)
        actions.setError(error.message)
        return false
    }finally{
        actions.setLoading(false)
    }
})

  
}