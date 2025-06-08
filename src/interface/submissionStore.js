import { action, thunk}  from "easy-peasy"
import api from "../api/courses"
export const submissionStore = {
  assignmentSubmissions: [],
  testSubmissions: [],

  // Student’s grade data
  studentAssignmentGrades: [],
  studentTestGrades: [],
  myGrades: {},
  loading: false,
  error: null,

  setLoading: action((state, payload) => {
    state.loading = payload;
  }),
  setError: action((state, payload) => {
    state.error = payload;
  }),
  setMyGrades: action((state,payload) => {
    state.myGrades = payload
  }),
  // ── ASSIGNMENT SUBMISSIONS ──
  setAssignmentSubmissions: action((state, payload) => {
    state.assignmentSubmissions = payload;
  }),
  setStudentAssignmentGrades: action((state, payload) => {
    state.studentAssignmentGrades = payload;
  }),
  fetchMyGrades: thunk(async(actions,{courseID, student_id}) => {
    actions.setLoading(true);
    try {
      const res = await api.get(`/courses/${courseID}/grades/${student_id}/`);
      actions.setMyGrades(res.data)
      actions.setError(null);
    } catch (err) {
      actions.setError(err.response?.data || err.message);
    } finally {
      actions.setLoading(false);
    }
  }),
  // Student creates an assignment submission
  createAssignmentSubmission: thunk(async (actions, { assignmentId, formData }) => {
    actions.setLoading(true);
    try {
      const res = await api.post(
        `/assignments/${assignmentId}/submit/`,
        formData);
      actions.setError(null);
      return { success: true, submission: res.data };
    } catch (err) {

      const msg = err.response?.data || err.message;
      console.log(msg)
      actions.setError(msg);
      return { success: false, error: msg };
    } finally {
      actions.setLoading(false);
    }
  }),

  // Staff fetch assignment submissions for grading
  fetchAssignmentSubmissions: thunk(async (actions, assignmentId) => {
    actions.setLoading(true);
    try {
      const res = await api.get(`/assignments/${assignmentId}/submissions/`);
      actions.setAssignmentSubmissions(res.data.results);
      actions.setError(null);
    } catch (err) {
      actions.setError(err.response?.data || err.message);
    } finally {
      actions.setLoading(false);
    }
  }),

  // Staff grades an assignment submission
  gradeAssignmentSubmission: thunk(async (actions, { submissionId, data }) => {
    actions.setLoading(true);
    try {
      const res = await api.patch(
        `/assignments/submissions/${submissionId}/`,
        data
      );
      actions.setError(null);
      return { success: true, updated: res.data };
    } catch (err) {
      const msg = err.response?.data || err.message;
      actions.setError(msg);
      return { success: false, error: msg };
    } finally {
      actions.setLoading(false);
    }
  }),

  // Student fetches all their assignment grades in a course
  fetchStudentAssignmentGrades: thunk(async (actions, { courseId, studentId }) => {
    actions.setLoading(true);
    try {
      const res = await api.get(
        `/courses/${courseId}/assignments/grades/${studentId}/`
      );
      actions.setStudentAssignmentGrades(res.data.results);
      actions.setError(null);
    } catch (err) {
      actions.setError(err.response?.data || err.message);
    } finally {
      actions.setLoading(false);
    }
  }),

  // ── TEST SUBMISSIONS ──
  setTestSubmissions: action((state, payload) => {
    state.testSubmissions = payload;
  }),
  setStudentTestGrades: action((state, payload) => {
    state.studentTestGrades = payload;
  }),

  // Student creates a test submission
  createTestSubmission: thunk(async (actions, { testId, formData }) => {
    actions.setLoading(true);
    try {
      const res = await api.post(
        `/tests/${testId}/submit/`,
        formData);
      actions.setError(null);
      return { success: true, submission: res.data };
    } catch (err) {
      const msg = err.response?.data || err.message;
      actions.setError(msg);
      return { success: false, error: msg };
    } finally {
      actions.setLoading(false);
    }
  }),

  // Staff fetch all test submissions for grading
  fetchTestSubmissions: thunk(async (actions, testId) => {
    actions.setLoading(true);
    try {
      const res = await api.get(`/tests/${testId}/submissions/`);
      actions.setTestSubmissions(res.data.results);
      actions.setError(null);
    } catch (err) {
      actions.setError(err.response?.data || err.message);
    } finally {
      actions.setLoading(false);
    }
  }),

  // Staff grades a test submission
  gradeTestSubmission: thunk(async (actions, { submissionId, data }) => {
    actions.setLoading(true);
    try {
      const res = await api.patch(`/tests/submissions/${submissionId}/`, data);
      actions.setError(null);
      return { success: true, updated: res.data };
    } catch (err) {
      const msg = err.response?.data || err.message;
      actions.setError(msg);
      return { success: false, error: msg };
    } finally {
      actions.setLoading(false);
    }
  }),

  // Student fetch all their test grades in a course
  fetchStudentTestGrades: thunk(async (actions, { courseId, studentId }) => {
    actions.setLoading(true);
    try {
      const res = await api.get(
        `/courses/${courseId}/tests/grades/${studentId}/`
      );
      actions.setStudentTestGrades(res.data.results);
      actions.setError(null);
    } catch (err) {
      actions.setError(err.response?.data || err.message);
    } finally {
      actions.setLoading(false);
    }
  }),
};

