import axios from 'axios';
import { createStore, action, persist ,thunk, computed} from 'easy-peasy';
import api from "../api/courses"
export const assignmentStore = { assignment : {
    id: 0,
    name: '',
    description: '',
    date_due : '',
    max_points: 0,
    assignment_file: '',
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

  // Optional: Update assignment
  updateAssignment: thunk(async (actions, { updatedData,course_id , courseStoreActions }) => {
    const formData = new FormData();
    if(updatedData.assignment_file !== null){
      formData.append('assignment_file',updatedData.assignment_file)
    }
    formData.append("name",updatedData.name)
    formData.append("date_due",updatedData.date_due)
    formData.append("description",updatedData.description)
    formData.append("max_points",updatedData.max_points)
    actions.setLoading(true);
    try {
      const response = await api.put(`/assignments/update/${updatedData.id}/`, formData)
      actions.setAssignment(response.data);
      courseStoreActions.updateAssignmentInCourse({
        courseId: course_id,   // Pass course_id to ensure it updates the correct course
        updatedAssignment: response.data,
    });
      actions.setError(null);
      return { success: true };
    } catch (err) {
      actions.setError(err.message);
      console.error("Failed to update Assignment:", err);
      return { success: false, error: err.response?.data || err.message };
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
      return { success: true };
    } catch (err) {
      actions.setError(err.message);
      console.error("Failed to create Assignment:", err);
      return { success: false, error: err.response?.data || err.message };
    } finally {
      actions.setLoading(false);
    }
  }),
  deleteAssignment: thunk(async(actions,{id, assignmentID,courseStoreActions}) => {
    actions.setLoading(true);
    try {
      courseStoreActions.removeAssignmentFromCourse({
         courseId: id,
         assignmentId: assignmentID
      })
      await api.delete(`/assignments/delete/${assignmentID}/`);
      actions.setAssignment({});
       // Reset the assignment state after deletion

      actions.setError(null);
      return true
    }catch(error){
        console.error("Error deleting the assignment:", error);
        actions.setError(error.message|| "Failed to delete assignment")
        return false
    }finally{
        actions.setLoading(false)
    }
})

  
}
