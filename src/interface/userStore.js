import axios from 'axios';
import { createStore, action, persist ,thunk, computed} from 'easy-peasy';
import api from "../api/courses"
import { PiAlignCenterHorizontalSimple } from 'react-icons/pi';
export const userStore = {
    // User data including username, email, and staff status
    user: {
        username: "",
        email: "",
        pk: "",
        is_staff: false,
    },

    // Profile and Canvas data for the user
    profile: {
        id: "",
        first_name: "",
        last_name: "",
        date_of_birth:"",
        email: ""
        // other profile fields
    },

    canvas: {
        id: "",
        list_courses: [],  // Array of courses the user is enrolled in
    },

    loading: false,
    error: null,

    // Action to set the entire user data
    setUser: action((state, payload) => {
        state.user = payload;
    }),

    // Action to set profile data
    setProfile: action((state, payload) => {
        state.profile = payload;
    }),

    // Action to set canvas data (courses the user is associated with)
    setCanvas: action((state, payload) => {
        state.canvas = payload;
    }),
    removeCourseFromCanvas: action((state, courseId) => {
        state.canvas.list_courses = state.canvas.list_courses.filter(
            (course) => course.id !== courseId
        );
    }),
    removeCourseFromCanvasThunk: thunk(async (actions, courseId) => {
    actions.setLoading(true);
        try {
            // Send request to backend to remove the course from canvas
            await api.put(`/canvas/courses/${localStorage.getItem("pk")}/`, {
                id: courseId
            });

            // Update the canvas in the local store
            actions.removeCourseFromCanvas(courseId);
            actions.setError(null);
        } catch (error) {
            actions.setError(error.message);
        } finally {
            actions.setLoading(false);
        }
    }),
    addCourseToCanvas: action((state, course) => {
    // Check if the course is already in the list to avoid duplicates
        if (!state.canvas.list_courses.some(existingCourse => existingCourse.id === course.id)) {
        state.canvas.list_courses.push(course);
        }
    }),
    register: thunk(async (actions, userData) => {
        actions.setLoading(true);
        try {
            const response = await api.post('/users/register/', userData);

            // If successful, set the user data and token in localStorage
            const { token, user } = response.data;
            localStorage.setItem("token", token);
            actions.setUser(user);

            actions.setError(null);
        } catch (error) {
            actions.setError(error.message);
        } finally {
            actions.setLoading(false);
        }
    }),
    logout: action((state) => {
        // Clear user data from the store
        state.user = {
            username: "",
            email: "",
            pk: "",
            is_staff: false
        };
        state.profile = {
            id: "",
            first_name: "",
            last_name: "",
            date_of_birth:"",
            email: ""
        };
        state.canvas = {
            id: "",
            list_courses: []  // Array of courses the user is enrolled in
        };
        state.error = null;
        state.loading = false;

        // Remove the token from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('pk'); // Optional: remove user id as well if stored
        localStorage.removeItem('userStore');
        localStorage.removeItem('assignmentStore');
        localStorage.removeItem('courseStore');
        localStorage.removeItem('lectureStore');
        localStorage.removeItem('messageStore');
        localStorage.removeItem('testStore');
        localStorage.removeItem('threadStore');
        // Optional: reset any other state you may want to clear on logout
    }),
    updateProfile: thunk(async(actions,{updatedProfile, course_id, courseStoreActions}) => {
            
            actions.setLoading(true)
            try{
                const response = await api.put(`/profiles/detail/`,updatedProfile)
                actions.setProfile(response.data)
                if (course_id) {
                // Update courses with the updated profile information
                    courseStoreActions.updateProfileInCourse({
                        courseId: course_id,   // The course ID
                        updatedProfile: response.data // The updated profile data
                    });
                }
                actions.setError(null)
    
            }catch(error){
                actions.setError(error.message)
            }finally{
                actions.setLoading(false)
            }
    }),
    addCourseToCanvasThunk: thunk(async (actions,  course) => {
        actions.setLoading(true);
        try {
            // Send a POST request to associate the course with the user
            await api.post(`/canvas/courses/${localStorage.getItem("pk")}/`,{ id: course.id });
            
            // Update the canvas in the store
            actions.addCourseToCanvas(course);  // Add the course to the local state
            actions.setError(null);
        } catch (error) {
            actions.setError(error.message);
        } finally {
            actions.setLoading(false);
        }
    }),
    // Thunk to fetch the user data along with profile and canvas from the backend
    fetchUser: thunk(async (actions, credentials) => {
        actions.setLoading(true);
        try {
            // Send login request to authenticate the user and get the token
            const response = await axios.post(`http://localhost:8000/users/login/`, credentials);
            const { token, user_id } = response.data;

            // Store the token and user_id in localStorage for subsequent requests
            localStorage.setItem("token", token);
            localStorage.setItem("pk", user_id);

            // Fetch the user profile details using the user_id
            const userResponse = await api.get(`/users/detail/${user_id}/`);
            actions.setUser(userResponse.data);  // Set the user data in store

            // Fetch the user profile details
            const profileResponse = await api.get(`/profiles/detail/`);
            actions.setProfile(profileResponse.data);  // Set profile data in store

            // Fetch the user's canvas (list of courses)
            const canvasResponse = await api.get(`/canvas/detail/${user_id}/`);
            actions.setCanvas({list_courses: canvasResponse.data.list_courses, id : canvasResponse.data.id});  // Set canvas (courses) data in store

            actions.setError(null);
            return userResponse.data;  // Return user data
        } catch (error) {
            actions.setError(error.message);
        } finally {
            actions.setLoading(false);
        }
    }),
    changePassword: thunk(async (actions, { oldPassword, newPassword }) => {
        actions.setLoading(true);
        try {
            // Make a PUT request to the password change API endpoint
            const response = await api.put(`/users/change_password/${localStorage.getItem("pk")}/`, { old_password: oldPassword, new_password: newPassword });

            // If successful, return success message (optionally update user data if needed)
            actions.setError(null); // Clear any previous errors
            return response.data; // You can return a success message
        } catch (error) {
            actions.setError(error.message); // Set error message if password change fails
        } finally {
            actions.setLoading(false); // Set loading to false after the request completes
        }
    }),
    // Action to set loading state
    setLoading: action((state, payload) => {
        state.loading = payload;
    }),

    // Action to set error state
    setError: action((state, payload) => {
        state.error = payload;
    }),
    getCoursesById: computed((state) => {
    return (id) => {
        const course = state.canvas.list_courses.find(course => String(course.id) === String(id));
        if (!course) {
            return { error: "Course not found" };
        }
        return course;
    };
}),
};