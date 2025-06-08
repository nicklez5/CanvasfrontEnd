import axios from 'axios';
import { createStore, action, persist ,thunk, computed} from 'easy-peasy';
import api from "../api/courses"
import { PiAlignCenterHorizontalSimple } from 'react-icons/pi';
export const courseStore = { 
    courses: [],
    loading: false,
    error: null,
    addCourse: action((state, course123) => {
        state.courses = [...state.courses, course123];  // Immutable push
    }),

    coursesCount: computed((state) => state.courses.length),
    createCourse: thunk(async (actions, courseData) => {
        actions.setLoading(true);
        try {
        // Make an API call to create the course
            const response = await api.post('/courses/post/', courseData); // Endpoint to create a course
            actions.addCourse(response.data); // Add the newly created course to the store
            actions.setError(null); 
            return { success: true };// Reset error state
        } catch (error) {
            actions.setError(error.message);
            return { success: false, error: error.message }; // Set error message
        } finally {
            actions.setLoading(false); // Reset loading state
        }
    }),
    deleteCourse: thunk(async (actions, courseId) => {
        actions.setLoading(true);
        try {
        // 1) Call the API to delete
        await api.delete(`/courses/delete/${courseId}/`);
        // 2) Remove from local store
        actions.removeCourseFromState(courseId);
        actions.setError(null);
        return { success: true };
        } catch (err) {
        const msg = err.response?.data || err.message;
        actions.setError(msg);
        return { success: false, error: msg };
        } finally {
        actions.setLoading(false);
        }
    }),
     removeCourseFromState: action((state, courseId) => {
        state.courses = state.courses.filter((c) => c.id !== courseId);
    }),
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
    getCoursesById: computed((state) => {
    const byId = state.courses.reduce((acc, c) => {
      acc[c.id] = c;
      return acc;
    }, {});
    return (id) => byId[id] || null;
    }),
    setCourses: action((state,payload) => {
        state.courses = payload
    }),
    addTestInCourse: action((state, { courseId, updatedTest }) => {
    // Find the course by courseId
    const courseIndex = state.courses.findIndex(course => course.id === courseId);

    // If the course exists
    if (courseIndex !== -1) {
        // Check if the test is already in the array to avoid duplicates
        const testExists = state.courses[courseIndex].tests.some(test => test.id === updatedTest.id);

        if (!testExists) {
            // Immutably update only the tests array of the selected course
            state.courses = state.courses.map((course, index) => {
                if (index === courseIndex) {
                    return {
                        ...course,  // Copy the existing course object
                        tests: [...course.tests, updatedTest]  // Add the new test immutably
                    };
                }
                return course;  // Return the other courses unchanged
            });
        }
    }
    }),
    removeTestFromCourse: action((state, { courseId, testId }) => {
    // Find the course by courseId
    const courseIndex = state.courses.findIndex(course => course.id === courseId);

    // If the course exists
    if (courseIndex !== -1) {
        // Use map to create a new array of courses
        state.courses = state.courses.map((course, index) => {
            if (index === courseIndex) {
                // Immutably remove the test by filtering the tests array
                return {
                    ...course,  // Copy the existing course object
                    tests: course.tests.filter(test => test.id !== testId)  // Remove the test with the specified testId
                };
            }
            return course;  // Return the other courses unchanged
        });
    }
    }),
    addAssignmentInCourse: action((state, { courseId, updatedAssignment }) => {
    // Find the course by courseId
    const courseIndex = state.courses.findIndex(course => course.id === courseId);

    // If the course exists
    if (courseIndex !== -1) {
        // Check if the assignment is already in the array to avoid duplicates
        const assignmentExists = state.courses[courseIndex].assignments.some(assignment => assignment.id === updatedAssignment.id);

        if (!assignmentExists) {
            // Immutably update only the assignments array of the selected course
            state.courses = state.courses.map((course, index) => {
                if (index === courseIndex) {
                    return {
                        ...course,  // Copy the existing course object
                        assignments: [...course.assignments, updatedAssignment]  // Add the new test immutably
                    };
                }
                return course;  // Return the other courses unchanged
            });
        }
    }
    }),
    removeAssignmentFromCourse: action((state, { courseId, assignmentId }) => {
    // Find the course by courseId
    const courseIndex = state.courses.findIndex(course => course.id === courseId);

    // If the course exists
    if (courseIndex !== -1) {
        // Use map to create a new array of courses
        state.courses = state.courses.map((course, index) => {
            if (index === courseIndex) {
                // Immutably remove the assignment by filtering the assignments array
                return {
                    ...course,  // Copy the existing course object
                    assignments: course.assignments.filter(assignment => assignment.id !== assignmentId)  // Remove the assignment with the specified assignmentId
                };
            }
            return course;  // Return the other courses unchanged
        });
    }
    }),
    removeStudentFromCourse: action((state, { courseId, studentId }) => {
        state.courses = state.courses.map((course) => {
        if (course.id === courseId) {
            // Remove the student from the course's profiles list
            return {
            ...course,
            profiles: course.profiles.filter((profile) => profile.id !== studentId),
            };
        }
        return course;
        });
    }),
    addThreadInCourse: action((state, { courseId, updatedThread }) => {
    // Find the course by courseId
    const courseIndex = state.courses.findIndex(course => course.id === courseId);

    // If the course exists
    if (courseIndex !== -1) {
        // Check if the thread is already in the array to avoid duplicates
        const threadExists = state.courses[courseIndex].threads.some(thread => thread.id === updatedThread.id);

        if (!threadExists) {
            // Immutably update only the threads array of the selected course
            state.courses = state.courses.map((course, index) => {
                if (index === courseIndex) {
                    return {
                        ...course,  // Copy the existing course object
                        threads: [...course.threads, updatedThread]  // Add the new test immutably
                    };
                }
                return course;  // Return the other courses unchanged
            });
        }
    }
    }),
    removeThreadFromCourse: action((state, { courseId, threadId }) => {
    // Find the course by courseId
    const courseIndex = state.courses.findIndex(course => course.id === courseId);

    // If the course exists
    if (courseIndex !== -1) {
        // Use map to create a new array of courses
        state.courses = state.courses.map((course, index) => {
            if (index === courseIndex) {
                // Immutably remove the thread by filtering the threads array
                return {
                    ...course,  // Copy the existing course object
                    threads: course.threads.filter(thread => thread.id !== threadId)  // Remove the assignment with the specified assignmentId
                };
            }
            return course;  // Return the other courses unchanged
        });
    }
    }),
    addMessageToThread: action((state, { courseId, threadId, message }) => {
    // Find the course by courseId
    const courseIndex = state.courses.findIndex(course => course.id === courseId);

    // If the course exists
    if (courseIndex !== -1) {
        // Use map to create a new array of courses
        state.courses = state.courses.map((course, index) => {
            if (index === courseIndex) {
                // If the course matches, update the threads
                return {
                    ...course,  // Copy the existing course object
                    threads: course.threads.map((thread) => {
                        if (thread.id === threadId) {
                            // If the thread matches, add the new message to the messages array
                            return {
                                ...thread,  // Copy the thread object
                                messages: [...thread.messages, message]  // Add the new message to the thread
                            };
                        }
                        return thread;  // Return the thread unchanged
                    })
                };
            }
            return course;  // Return the course unchanged
        });
    }
    }),
    updateMessageInThread: action((state, { courseId, threadId, messageId, updatedMessage }) => {
    const courseIndex = state.courses.findIndex(course => course.id === courseId);

    if (courseIndex !== -1) {
        state.courses = state.courses.map(course => {
            if (course.id === courseId) {
                // Update the threads of the course
                return {
                    ...course,
                    threads: course.threads.map(thread => {
                        if (thread.id === threadId) {
                            // Update the messages in the thread
                            return {
                                ...thread,
                                messages: thread.messages.map(message => {
                                    if (message.id === messageId) {
                                        // Update the message
                                        return updatedMessage;
                                    }
                                    return message;
                                })
                            };
                        }
                        return thread;
                    })
                };
            }
            return course;
        });
    }
    }),
    removeMessageFromThread: action((state, { courseId, threadId, messageId }) => {
    state.courses = state.courses.map((course) => {
        if (course.id !== courseId) return course;

        return {
        ...course,
        threads: course.threads.map((thread) => {
            if (thread.id !== threadId) return thread;

            // Make sure `thread.list_of_messages` exists (fallback to empty array)
            const existing = Array.isArray(thread.list_of_messages)
            ? thread.list_of_messages
            : [];

            return {
            ...thread,
            list_of_messages: existing.filter(
                (message) => message.id !== messageId
            ),
            };
        }),
        };
    });
    }),
    
    addLectureInCourse: action((state, { courseID, updatedLecture }) => {
    // Update the course's lectures with the new lecture
    state.courses = state.courses.map((course) => {
        if (course.id === courseID) {
            return {
                ...course,
                lectures: [...course.lectures, updatedLecture], // Add the new lecture
            };
        }
        return course;
    });
    }),
    removeLectureFromCourse: action((state, { courseId, lectureId }) => {
    // Find the course by courseId
    const courseIndex = state.courses.findIndex(course => course.id === courseId);

    // If the course exists
    if (courseIndex !== -1) {
        // Use map to create a new array of courses
        state.courses = state.courses.map((course, index) => {
            if (index === courseIndex) {
                // Immutably remove the lecture by filtering the lectures array
                return {
                    ...course,  // Copy the existing course object
                    lectures: course.lectures.filter(lecture => lecture.id !== lectureId)  // Remove the test with the specified testId
                };
            }
            return course;  // Return the other courses unchanged
        });
    }
    }),
    setCourseDetails: action((state, { courseId, updatedCourseData }) => {
    // Use map to create a new courses array with the updated course
        state.courses = state.courses.map(course => {
            if (course.id === courseId) {
                // Return the updated course by merging the existing course data with the new data
                return { ...course, ...updatedCourseData };
            }
            return course;  // If the course doesn't match, return it unchanged
    });
    }),
    updateCourse: thunk(async (actions, {courseId,newName, newDescription}) => {
        actions.setLoading(true)
        try{
            const response = await api.put(`/courses/update/${courseId}/`,{
                name: newName,
                description: newDescription
            });
            const updated = response.data
            actions.setCourseDetails({
                courseId,
                updatedCourseData: updated,
            })
            actions.setError(null)
            return {success : true};
        }catch(err){
            actions.setError(err.response?.data || err.message);
            return {success: false, error: err.response?.data || err.message}
        }finally{
            actions.setLoading(false)
        }
    }),

     
    fetchCourseDetails: thunk(async (actions, courseId) => {
        actions.setLoading(true);  // Set loading to true before making the API call

        try {
            // Make an API call to fetch the course details, assignments, lectures, etc.
            const response = await api.get(`/courses/detail/${courseId}/`);
            
            const { id,name, assignments, lectures, tests, profiles, threads } = response.data;
            
            const updatedCourse = {
                id,
                name,              // Copy the course data
                assignments,             // Add assignments to the course
                lectures,                // Add lectures to the course
                tests,                   // Add tests to the course
                profiles,                // Add profiles to the course
                threads,                 // Add threads to the course
            };
            //console.log("Course Data:" , JSON.stringify(updatedCourse))
            // Update the store with the fetched data
             actions.setCourses([updatedCourse]);  // Set the updated course information in the courses array

              // Set threads for the course

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
    
    // Optional: Update assignment
    
    updateAssignmentInCourse: action((state, { courseId, updatedAssignment }) => {
    // Use map to create a new courses array with the updated assignment
    state.courses = state.courses.map(course => {
        if (course.id === courseId) {
            // Update the assignments array by mapping over it
            return {
                ...course,  // Copy the existing course object
                assignments: course.assignments.map(assignment => 
                    assignment.id === updatedAssignment.id ? updatedAssignment : assignment
                )  // Replace the updated assignment
            };
        }
        return course;  // Return the course unchanged if it doesn't match courseId
    });
    }),  
    updateThreadInCourse: action((state, { courseId, updatedThread }) => {
    // Use map to create a new courses array with the updated thread
    state.courses = state.courses.map(course => {
        if (course.id === courseId) {
            // Update the threads array by mapping over it
            return {
                ...course,  // Copy the existing course object
                threads: course.threads.map(thread => 
                    thread.id === updatedThread.id ? updatedThread : thread
                )  // Replace the updated thread
            };
        }
        return course;  // Return the course unchanged if it doesn't match courseId
    });
}),
    updateLectureInCourse: action((state, { courseId, updatedLecture }) => {
    // Use map to create a new courses array with the updated lecture
    state.courses = state.courses.map(course => {
        if (course.id === courseId) {
            // Update the lectures array by mapping over it
            return {
                ...course,  // Copy the existing course object
                lectures: course.lectures.map(lecture => 
                    lecture.id === updatedLecture.id ? updatedLecture : lecture
                )  // Replace the updated lecture
            };
        }
        return course;  // Return the course unchanged if it doesn't match courseId
    });
}),
   updateTestInCourse: action((state, { courseId, updatedTest }) => {
    // Use map to create a new courses array with the updated test
    state.courses = state.courses.map(course => {
        if (course.id === courseId) {
            // Update the tests array by mapping over it
            return {
                ...course,  // Copy the existing course object
                tests: course.tests.map(test => 
                    test.id === updatedTest.id ? updatedTest : test
                )  // Replace the updated test
            };
        }
        return course;  // Return the course unchanged if it doesn't match courseId
    });
}),
}
