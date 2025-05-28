import axios from 'axios';
import { createStore, action, persist ,thunk, computed} from 'easy-peasy';
import api from "../api/courses"
import { PiAlignCenterHorizontalSimple } from 'react-icons/pi';
export const courseStore = { 
    courses: [],
    loading: false,
    error: null,
    addCourse: action((state,course123) => {
        state.courses.push(course123)
    }),
    deleteCourse: action((state,courseID) => {
        state.courses = state.courses.filter(a => a.id !== courseID)
    }),
    coursesCount: computed((state) => state.courses.length),
    fetchCourses: thunk(async(actions) => {
        actions.setLoading(true);
        try {
            const response = await api.get('/courses/'); // Assuming `api` is an Axios instance

            // Check for a successful response
            if (response.status !== 200) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Set courses and clear error
            actions.setCourses(response.data);  // response.data will contain the courses
            actions.setError(null);  // Clear any previous errors

            return response.data;  // Optionally return the courses here
        } catch (err) {
            // Set error message if an error occurs
            actions.setError(err.message);
        } finally {
            actions.setLoading(false);  // Turn off the loading state
        }
    }),
    getCoursesById: computed ((state) => {
        return(id) => 
             state.courses.find(course => (course.id).toString() === id);
    }),
    setCourses: action((state,payload) => {
        state.courses = payload
    }),
    setAssignmentsForCourse: action((state,payload) => {
        state.assignments = payload
    }),
    setLecturesForCourse: action((state,payload) => {
        state.lectures = payload
    }),
    setTestsForCourse: action((state,payload) => {
        state.tests = payload
    }),
    setProfilesForCourse: action((state,payload) => {
        state.profiles = payload
    }),
    setThreadsForCourse: action((state,payload) => {
        state.threads = payload
    }),
    addTestInCourse: action((state, { courseId, updatedTest }) => {
        const courseIndex = state.courses.findIndex(course => course.id === courseId);
    
    // Check if the course exists
        if (courseIndex !== -1) {
            // Check if the test is already in the array to avoid duplicates
            const testExists = state.courses[courseIndex].tests.some(
                test => test.id === updatedTest.id
            );

            if (!testExists) {
                // Add the updated test only if it's not already in the tests array
                state.courses[courseIndex].tests.push(updatedTest);
            }
        }
    }),
    removeTestFromCourse: action((state, { courseId, testId }) => {
        const courseIndex = state.courses.findIndex(course => course.id === courseId);
        
        if (courseIndex !== -1) {
            // Find the index of the test to remove
            const testIndex = state.courses[courseIndex].tests.findIndex(
            test => test.id === testId
            );

            // If the test is found, remove it from the array
            if (testIndex !== -1) {
            state.courses[courseIndex].tests.splice(testIndex, 1);
            }
        }
    }),
    addAssignmentInCourse: action((state, { courseId, updatedAssignment }) => {
        const courseIndex = state.courses.findIndex(course => course.id === courseId);
    
    // Check if the course exists
        if (courseIndex !== -1) {
            // Check if the assignment is already in the array to avoid duplicates
            const assignmentExists = state.courses[courseIndex].assignments.some(
                assignment => assignment.id === updatedAssignment.id
            );

            if (!assignmentExists) {
                // Add the updated assignment only if it's not already in the assignments array
                state.courses[courseIndex].assignments.push(updatedAssignment);
            }
        }
    }),
    removeAssignmentFromCourse: action((state, { courseId, assignmentId }) => {
        const courseIndex = state.courses.findIndex(course => course.id === courseId);
        
        if (courseIndex !== -1) {
            // Find the index of the assignment to remove
            const assignmentIndex = state.courses[courseIndex].assignments.findIndex(
            assignment => assignment.id === assignmentId
            );

            // If the assignment is found, remove it from the array
            if (assignmentIndex !== -1) {
            state.courses[courseIndex].assignments.splice(assignmentIndex, 1);
            }
        }
    }),
    addThreadInCourse: action((state, { courseId, updatedThread }) => {
        const courseIndex = state.courses.findIndex(course => course.id === courseId);
    
    // Check if the course exists
        if (courseIndex !== -1) {
            // Check if the thread is already in the array to avoid duplicates
            const threadExists = state.courses[courseIndex].threads.some(
                thread => thread.id === updatedThread.id
            );

            if (!threadExists) {
                // Add the updated thread only if it's not already in the threads array
                state.courses[courseIndex].threads.push(updatedThread);
            }
        }
    }),
    removeThreadFromCourse: action((state, { courseId, threadId }) => {
        const courseIndex = state.courses.findIndex(course => course.id === courseId);
        
        if (courseIndex !== -1) {
            // Find the index of the thread to remove
            const threadIndex = state.courses[courseIndex].threads.findIndex(
            thread => thread.id === threadId
            );

            // If the thread is found, remove it from the array
            if (threadIndex !== -1) {
            state.courses[courseIndex].threads.splice(threadIndex, 1);
            }
        }
    }),
    addMessageToThread: action((state, { courseId, threadId, message }) => {
    // Find the course by courseId
        const courseIndex = state.courses.findIndex(course => course.id === courseId);
        
        if (courseIndex !== -1) {
            // Find the thread by threadId
            const threadIndex = state.courses[courseIndex].threads.findIndex(
                thread => thread.id === threadId
            );

            if (threadIndex !== -1) {
                // Add the new message to the thread's messages list
                state.courses[courseIndex].threads[threadIndex].messages.push(message);
            }
        }
    }),
    updateMessageInThread: action((state, { courseId, threadId, messageId, updatedMessage }) => {
        const courseIndex = state.courses.findIndex(course => course.id === courseId);
        if (courseIndex !== -1) {
            const threadIndex = state.courses[courseIndex].threads.findIndex(
                thread => thread.id === threadId
            );
            if (threadIndex !== -1) {
                const messageIndex = state.courses[courseIndex].threads[threadIndex].messages.findIndex(
                    message => message.id === messageId
                );
                if (messageIndex !== -1) {
                    state.courses[courseIndex].threads[threadIndex].messages[messageIndex] = updatedMessage;
                }
            }
        }
    }),
    removeMessageFromThread: action((state, { courseId, threadId, messageId }) => {
        const courseIndex = state.courses.findIndex(course => course.id === courseId);
        if (courseIndex !== -1) {
            const threadIndex = state.courses[courseIndex].threads.findIndex(
                thread => thread.id === threadId
            );
            if (threadIndex !== -1) {
                const messageIndex = state.courses[courseIndex].threads[threadIndex].messages.findIndex(
                    message => message.id === messageId
                );
                if (messageIndex !== -1) {
                    state.courses[courseIndex].threads[threadIndex].messages.splice(messageIndex, 1);
                }
            }
        }
    }),
    addProfileInCourse: action((state, { courseId, updatedProfile }) => {
        const courseIndex = state.courses.findIndex(course => course.id === courseId);
    
    // Check if the course exists
        if (courseIndex !== -1) {
            // Check if the profile is already in the array to avoid duplicates
            const profileExists = state.courses[courseIndex].profiles.some(
                profile => profile.id === updatedProfile.id
            );

            if (!profileExists) {
                // Add the updated profile only if it's not already in the profiles array
                state.courses[courseIndex].profiles.push(updatedProfile);
            }
        }
    }),
    removeProfileFromCourse: action((state, { courseId, profileId }) => {
        const courseIndex = state.courses.findIndex(course => course.id === courseId);
        
        if (courseIndex !== -1) {
            // Find the index of the profile to remove
            const profileIndex = state.courses[courseIndex].profiles.findIndex(
            profile => profile.id === profileId
            );

            // If the profile is found, remove it from the array
            if (profileIndex !== -1) {
            state.courses[courseIndex].profiles.splice(profileIndex, 1);
            }
        }
    }),
    addLectureInCourse: action((state, { courseId, updatedLecture }) => {
        const courseIndex = state.courses.findIndex(course => course.id === courseId);
    
    // Check if the course exists
        if (courseIndex !== -1) {
            // Check if the lecture is already in the array to avoid duplicates
            const lectureExists = state.courses[courseIndex].lectures.some(
                lecture => lecture.id === updatedLecture.id
            );

            if (!lectureExists) {
                // Add the updated lecture only if it's not already in the lectures array
                state.courses[courseIndex].lectures.push(updatedLecture);
            }
        }
    }),
    removeLectureFromCourse: action((state, { courseId, lectureId }) => {
        const courseIndex = state.courses.findIndex(course => course.id === courseId);
        
        if (courseIndex !== -1) {
            // Find the index of the lecture to remove
            const lectureIndex = state.courses[courseIndex].lectures.findIndex(
            lecture => lecture.id === lectureId
            );

            // If the lecture is found, remove it from the array
            if (lectureIndex !== -1) {
            state.courses[courseIndex].lectures.splice(lectureIndex, 1);
            }
        }
    }),
    setCourseDetails: action((state, { courseId, updatedCourseData }) => {
    // Find the index of the course in the courses array
        const courseIndex = state.courses.findIndex(course => course.id === courseId);

        // If the course is found, update the course details
        if (courseIndex !== -1) {
            state.courses[courseIndex] = {
            ...state.courses[courseIndex],  // Retain existing course data
            ...updatedCourseData,           // Update with the new data (assignments, lectures, etc.)
            };
    }
    }),
    updateCourse: action((state, { courseId, updatedCourse }) => {
    const courseIndex = state.courses.findIndex(course => course.id === courseId);
        if (courseIndex !== -1) {
            state.courses[courseIndex] = updatedCourse;  // Replace the old course data with updated data
        }
    }),

     
    fetchCourseDetails: thunk(async (actions, courseId) => {
        actions.setLoading(true);  // Set loading to true before making the API call

        try {
            // Make an API call to fetch the course details, assignments, lectures, etc.
            const response = await api.get(`/courses/detail/${courseId}/`);
            
            const { course, assignments, lectures, tests, profiles, threads } = response.data;

            // Update the store with the fetched data
            actions.setCourses([course]);           // Set the course information
            actions.setAssignmentsForCourse(assignments);  // Set assignments for the course
            actions.setLecturesForCourse(lectures);  // Set lectures for the course
            actions.setTestsForCourse(tests);       // Set tests for the course
            actions.setProfilesForCourse(profiles); // Set profiles for the course
            actions.setThreadsForCourse(threads);   // Set threads for the course

            actions.setError(null);  // Reset any previous errors
        } catch (error) {
            // Handle errors
            actions.setError(error.message);
        } finally {
            actions.setLoading(false);  // Set loading to false after the API call completes
        }
    }),
    

    setLoading: action((state, payload) => {
        state.loading = payload;
    }),
    setError: action((state, payload) => {
        state.error = payload;
    }),
    updateCourseName: thunk(async (actions, {course_id , newCourseName}, helpers) => {
        const data = {
            name: newCourseName
        }
        actions.setLoading(true)
        try{
            const response = await api.put(`/courses/update/${course_id}/`, data);
            actions.updateCourse({
                courseId: course_id, 
                updatedCourse: response.data,
            });
        }catch(err){
            console.log(`Error: ${err.message}`)
        }finally{
            actions.setLoading(false)
        }
        }),
    // Optional: Update assignment
    
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
    updateTestsInCourse: action((state, { courseId, updatedTest }) => {
    const courseIndex = state.courses.findIndex(course => course.id === courseId);
    if (courseIndex !== -1) {
        const testIndex = state.courses[courseIndex].tests.findIndex(
            a => a.id === updatedTest.id
        );
        if (testIndex !== -1) {
            state.courses[courseIndex].tests[testIndex] = updatedTest;
        }
    }
   }),
    updateProfilesInCourse: action((state, { courseId, updatedProfile }) => {
    const courseIndex = state.courses.findIndex(course => course.id === courseId);
    if (courseIndex !== -1) {
        const testIndex = state.courses[courseIndex].profiles.findIndex(
            a => a.id === updatedProfile.id
        );
        if (testIndex !== -1) {
            state.courses[courseIndex].profiles[testIndex] = updatedProfile;
        }
    }

    }),
    updateLecturesInCourse: action((state, { courseId, updatedLecture }) => {
    const courseIndex = state.courses.findIndex(course => course.id === courseId);
    if (courseIndex !== -1) {
        const lectureIndex = state.courses[courseIndex].lectures.findIndex(
            a => a.id === updatedLecture.id
        );
        if (lectureIndex !== -1) {
            state.courses[courseIndex].lectures[lectureIndex] = updatedLecture;
        }
    }
   }), 
   updateThreadsInCourse: action((state, { courseId, updatedThread }) => {
    const courseIndex = state.courses.findIndex(course => course.id === courseId);
    if (courseIndex !== -1) {
        const threadIndex = state.courses[courseIndex].threads.findIndex(
            a => a.id === updatedThread.id
        );
        if (threadIndex !== -1) {
            state.courses[courseIndex].threads[threadIndex] = updatedThread;
        }
    }
   }),
}
