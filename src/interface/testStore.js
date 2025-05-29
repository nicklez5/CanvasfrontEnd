import axios from 'axios';
import { createStore, action, persist ,thunk, computed} from 'easy-peasy';
import api from "../api/courses"
export const testStore = { test : {
    id: '',
    name: '',
    submitter: '',
    description: '',
    date_due : '',
    max_points: 0,
    student_points: 0,
    file: '',
    student_file: ''
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
  submitTest: thunk(async (actions, { testData, courseID, testID, courseStoreActions }) => {
    const formData = new FormData();
    formData.append("student_file", testData.student_file);
    formData.append("student_points", testData.student_points);  // Optional score

    actions.setLoading(true);

    try {
        // Step 1: Submit the test file (PUT request to backend)
        const response = await api.put(`/tests/submit/${testID}/`, formData);

        // Step 3: Update the frontend state (update the test in the course’s tests)
        courseStoreActions.updateTestInCourse({
            courseId: courseID,
            updatedTest: response.data, // Updated test data returned from the API
        });

        actions.setError(null);  // Clear any errors
    } catch (error) {
        actions.setError(error.message);  // Handle errors
    } finally {
        actions.setLoading(false);  // Stop loading
    }
}),
  // Optional: Update assignment
  updateTest: thunk(async (actions, { updatedData, id , courseStoreActions }) => {
    const formData = new FormData();
    formData.append('file', updatedData.file);
    formData.append("name",updatedData.name)
    formData.append("date_due",updatedData.date_due)
    formData.append("description",updatedData.description)
    formData.append("max_points",updatedData.max_points)
    formData.append("student_points",updatedData.student_points)
    actions.setLoading(true);
    try {
      const response = await api.put(`/tests/update/${updatedData.id}/`, formData)
      actions.setTests(response.data);
      courseStoreActions.updateTestsInCourse({
        courseId: id,   // Pass course_id to ensure it updates the correct course
        updatedTest: response.data,
    });
      actions.setError(null);
    } catch (err) {
      actions.setError(err.message);
    } finally {
      actions.setLoading(false);
    }
  }),
  createTest: thunk(async(actions,{testData, id, courseStoreActions} ) => {
    const formData = new FormData();
    formData.append('file',testData.file)
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
    } catch (err) {
      actions.setError(err.message);
    } finally {
      actions.setLoading(false);
    }
  }),
  deleteTest: thunk(async(actions,{id, testID,courseStoreActions}) => {
    actions.setLoading(true);
    try {
      await api.delete(`/tests/delete/${testID}/`);
      actions.setTests({});
       // Reset the test state after deletion
       
      courseStoreActions.removeTestFromCourse({
         courseId: id,
         testId: testID
      })
      actions.setError(null);
    }catch(error){
        actions.setError(error.message)
    }finally{
        actions.setLoading(false)
    }
})

  
}