import axios from 'axios';
import { createStore, action, persist ,thunk, computed} from 'easy-peasy';
import api from "../api/courses"
export const assignmentStore = { assignment : {
    id: '',
    name: '',
    submitter: '',
    description: '',
    date_due : '',
    max_points: 0,
    student_points: 0,
    assignment_file: '',
    student_file: ''
},
  loading: false,
  error: null,

  // Sets the current assignment object
  setAssignment: action((state, payload) => {
    state.assignment = payload;
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
  fetchAssignment: thunk(async (actions, assignmentID) => {
    actions.setLoading(true);
    try {
      const response = await api.get(`/assignments/detail/${assignmentID}/`);
      actions.setAssignment(response.data);
      actions.setError(null);
    } catch (error) {
      actions.setError(error.message);
    } finally {
      actions.setLoading(false);
    }
  }),
  submitAssignment: thunk(async (actions, { assignmentData, courseID, assignmentID, courseStoreActions }) => {
      const formData = new FormData();
      formData.append("student_file", assignmentData.student_file);
      formData.append("student_points", assignmentData.student_points);  // Optional score
  
      actions.setLoading(true);
  
      try {
          // Step 1: Submit the assignment file (PUT request to backend)
          const response = await api.put(`/assignments/submit/${assignmentID}/`, formData);
          actions.setAssignment(response.data)
          // Step 3: Update the frontend state (update the assignment in the course’s assignments)
          courseStoreActions.updateAssignmentInCourse({
              courseId: courseID,
              updatedAssignment: response.data, // Updated test data returned from the API
          });
  
          actions.setError(null);  // Clear any errors
      } catch (error) {
          actions.setError(error.message);  // Handle errors
      } finally {
          actions.setLoading(false);  // Stop loading
      }
  }),
  // Optional: Update assignment
  updateAssignment: thunk(async (actions, { updatedData,course_id , courseStoreActions }) => {
    const formData = new FormData();
    formData.append('assignment_file',updatedData.assignment_file)
    formData.append("name",updatedData.name)
    formData.append("date_due",updatedData.date_due)
    formData.append("description",updatedData.description)
    formData.append("max_points",updatedData.max_points)
    formData.append("student_points",updatedData.student_points)
    actions.setLoading(true);
    try {
      const response = await api.put(`/assignments/update/${updatedData.id}/`, formData)
      actions.setAssignment(response.data);
      courseStoreActions.updateAssignmentInCourse({
        courseId: course_id,   // Pass course_id to ensure it updates the correct course
        updatedAssignment: response.data,
    });
      actions.setError(null);
    } catch (err) {
      actions.setError(err.message);
    } finally {
      actions.setLoading(false);
    }
  }),
  createAssignment: thunk(async(actions,{assignmentData, id, courseStoreActions} ) => {
    const formData = new FormData();
    formData.append('assignment_file',assignmentData.assignment_file)
    formData.append("name",assignmentData.name)
    formData.append("date_due",assignmentData.date_due)
    formData.append("description",assignmentData.description)
    formData.append("max_points",assignmentData.max_points)
    actions.setLoading(true);
    try {
      const response = await api.post(`/assignments/post/`, formData)
      const assignment = response?.data;
      if (!assignment?.id) throw new Error("Assignment creation failed: No ID returned");
      actions.setAssignment(assignment); // Update the store with the created assignment
      // Step 2: Link the assignment to the course
      // Here we send a simple JSON object to link the assignment to the course
      const linkData = { id: assignment.id };  // Use JSON instead of FormData
      await api.post(`/courses/assignments/${id}/`, linkData);
      courseStoreActions.addAssignmentInCourse({
         courseId : id,
         updatedAssignment: assignment
      })
      actions.setError(null);
    } catch (err) {
      actions.setError(err.message);
    } finally {
      actions.setLoading(false);
    }
  }),
  deleteAssignment: thunk(async(actions,{id, assignmentID,courseStoreActions}) => {
    actions.setLoading(true);
    try {
      await api.delete(`/assignments/delete/${assignmentID}/`);
      actions.setAssignment({});
       // Reset the assignment state after deletion

      courseStoreActions.removeAssignmentFromCourse({
         courseId: id,
         assignmentId: assignmentID
      })
      actions.setError(null);
    }catch(error){
        actions.setError(error.message)
    }finally{
        actions.setLoading(false)
    }
})

  
}
