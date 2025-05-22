import {createStore, action, thunk, computed} from 'easy-peasy'
import { useState,useParams } from 'react';
import api from './api/courses';
import { data } from 'react-router-dom';

export default createStore({
    courses: [],
    setCourses: action((state,payload) => {
        console.log(payload)
        state.courses = payload
    }),
    assignments: [],
    setAssignments: action((state,payload) => {
        state.assignments = payload
    }),
    
    canvasCourses: [],
    setCanvasCourses: action((state,payload) => {
        state.canvasCourses = payload
    }),
    
    courseName: '',
    setCourseName: action((state,payload) => {
        state.courseName = payload
    }),
    lectureName: '',
    setLectureName: action((state,payload) => {
        state.lectureName = payload
    }),
    lectureDescription: '',
    setLectureDescription: action((state,payload) => {
        state.lectureDescription = payload
    }),
    lectureFile: '',
    setLectureFile: action((state,payload) => {
        state.lectureFile = payload
    }),
    
    assignmentName: '',
    setAssignmentName: action((state,payload) => {
        state.assignmentName = payload
    }),
 
    assignmentSubmitter: '',
    setAssignmentSubmitter: action((state,payload) => {
        state.assignmentSubmitter = payload
    }),
    assignmentDate: '',
    setAssignmentDate: action((state,payload) => {
        state.assignmentDate = payload
    }),
    assignmentMaxPoints: '',
    setAssignmentMaxPoints: action((state,payload) => {
        state.assignmentMaxPoints = payload
    }),
    assignmentStudentPoints:'',
    setAssignmentStudentPoints: action((state,payload) => {
        state.assignmentStudentPoints = payload
    }),
    
    assignmentDescription: '',
    setAssignmentDescription: action((state,payload) => {
        state.assignmentDescription = payload
    }),
    assignmentFile: '',
    setAssignmentFile: action((state,payload) => {
        state.assignmentFile = payload
    }),
    messageAuthor: '',
    setMessageAuthor: action((state,payload) => {
        state.messageAuthor = payload
    }),
    messageDescription: '',
    setMessageDescription: action((state,payload) => {
        state.messageDescription = payload
    }),
    messageTimestamp: '',
    setMessageTimestamp: action((state,payload) => {
        state.messageTimestamp = payload
    }),
    profileUser: null,
    setProfileUser: action((state,payload) => {
        state.profileUser = payload
    }),
    profileFirstName: '',
    setProfileFirstName: action((state,payload) => {
        state.profileFirstName = payload
    }),
    profileLastName: '',
    setProfileLastName: action((state,payload) => {
        state.profileLastName = payload
    }),
    profileDOB: '',
    setProfileDOB: action((state,payload) => {
        state.profileDOB = payload
    }),
    testName: '',
    setTestName: action((state,payload) => {
        state.testName = payload
    }),
    testSubmitter: '',
    setTestSubmitter: action((state,payload) => {
        state.testSubmitter = payload
    }),
    testDate: '',
    setTestDate: action((state,payload) => {
        state.testDate = payload
    }),
    testMaxPoints: '',
    setTestMaxPoints: action((state,payload) => {
        state.testMaxPoints = payload
    }),
    testStudentPoints:'',
    setTestStudentPoints: action((state,payload) => {
        state.testStudentPoints = payload
    }),
    testDescription: '',
    setTestDescription: action((state,payload) => {
        state.testDescription = payload
    }),
    testFile: '',
    setTestFile: action((state,payload) => {
        state.testFile = payload
    }),
    threads: [],
    setThreads: action((state,payload) => {
        state.threads = payload
    }),
    threadListMessages: [],
    setThreadListMessages: action((state,payload) => {
        state.threadListMessages = payload
    }),
    threadLastAuthor: '',
    setThreadLastAuthor: action((state,payload) => {
        state.threadLastAuthor = payload
    }),
    threadDescription: '',
    setThreadDescription: action((state,payload) => {
        state.threadDescription = payload
    }),
    threadTimeStamp: '',
    setThreadTimeStamp: action((state,payload) => {
        state.threadTimeStamp = payload
    }),
    
    userName: '',
    setUserName: action((state,payload) => {
        state.userName = payload
    }),
    userEmail: '',
    setUserEmail: action((state,payload) => {
        state.userEmail = payload
    }),
    userDateJoined: '',
    setUserDateJoined: action((state,payload) => {
        state.userDateJoined = payload
    }),
    userStaff: false,
    setUserStaff: action((state,payload) => {
        state.userStaff = payload
    }),
    
    coursesCount: computed((state) => state.courses.length),
    // assignmentsCount: computed((state) => state.assignments.length),
    // testsCount: computed((state) => state.tests.length),
    // threadsCount: computed((state) => state.threads.length),
    getLectureById: computed((state) => {
        return(id) => {
            return state.lectures.find(lecture => (lecture.id).toString() === id)
        }
    }),
    getAssignments: thunk(async( actions, courseID, helpers) => {
        const { courses} = helpers.getState()
        const courseid = courseID
        try{
            await api.get(`/courses/assignment/${courseid}/`, 
                 {headers: {'Authorization':`Token ${localStorage.getItem('token')}` }}
            ).then((res) => {actions.setAssignments(res.data)})
        }catch(err){
            console.log(`Error: ${err.message}`)
        }
        
    }),
    getAssignmentsById: computed((state) => {
        return (id,id2) => {
            let courses = state.courses.find((course) => (course.id).toString() === id)
            return courses.assignments.find((assignment) => (assignment.id).toString() === id2);
        }
    }),
    addCourse: thunk(async(actions,courseID,helpers) => {
        
        const { canvasCourses} = helpers.getState()
        try{
            const response = await api.put(`/canvas/add_course/${localStorage.getItem("pk")}/`,
            {  id : courseID }, {headers: {
                'Authorization':`Token ${localStorage.getItem('token')}`,
               
             }})
            console.log(response)
            actions.setCanvasCourses(response.data.list_courses)
        }catch(err){
            console.log(`Error: ${err.message}`)
        }
    }),
    removeCourse: thunk(async(actions,courseID,helpers) => {
        
        const { canvasCourses} = helpers.getState()
        try{
            const response = await api.delete(`/canvas/delete_course/${localStorage.getItem("pk")}/`,{headers: {
                'Authorization':`Token ${localStorage.getItem('token')}`
            }
            ,data: { id : courseID }})
            console.log(response)
            actions.setCanvasCourses(response.data.list_courses)
        }catch(err){
            console.log(`Error: ${err.message}`)
        }
    }), 
    getCoursesById: computed ((state) => {
        return(id) => 
             state.courses.find(course => (course.id).toString() === id);
             
    }),
    saveCourse: thunk(async (actions, newCourse,helpers) => {
        const { courses} = helpers.getState();
        try{
            const response = await api.post('/courses/post/', newCourse ,
                {headers: {'Authorization':`Token ${localStorage.getItem('token')}` }});
            actions.setCourses([courses, ...response.data])
            actions.setCourseName('')
            actions.setCoursesAssignments({})
            actions.setCoursesLectures({})
            actions.setCoursesProfiles({})
            actions.setCoursesTests({})
            actions.setCoursesThreads({})
        }catch(err){
            console.log(`Error: ${err.message}`)
        }
    }),
    saveAssignment: thunk(async ( actions, [...newAssignment], helpers) =>{

        const { courses, canvasCourses } = helpers.getState();
        const formData = new FormData();
        formData.append("id", newAssignment[0].id)
        formData.append('file',newAssignment[0].file)
        formData.append("name",newAssignment[0].name)
        formData.append("date_due",newAssignment[0].date_due)
        formData.append("description",newAssignment[0].description)
        formData.append("max_points",newAssignment[0].max_points)
        formData.append("student_points",newAssignment[0].student_points)
        formData.append("submitter",newAssignment[0].submitter)
        try{
            const response = await api.post(`/courses/assignment/${newAssignment[1]}/`,formData, {headers: {
                'Authorization':`Token ${localStorage.getItem('token')}`,
                'Content-Type': 'multipart/form-data'
            }})
            actions.setCourses(courses.map(course => (course.id).toString() === newAssignment[1] ? {...response.data}: course))
            actions.setCanvasCourses(canvasCourses.map(course => (course.id).toString() === newAssignment[1] ? {...response.data} : course))
            actions.setAssignmentName('')
            actions.setAssignmentDate('')
            actions.setAssignmentDescription('')
            actions.setAssignmentFile('')
            actions.setAssignmentMaxPoints('')
            actions.setAssignmentStudentPoints('')
            actions.setAssignmentSubmitter('')
        }catch(err){
            console.log(`Error: ${err.message}`)
        }
    }),
    deleteTest: thunk(async(actions, [...array], helpers) => {
        const { courses} = helpers.getState();
        try{
            const response = await api.delete(`/courses/test/${array[1]}/`, {headers: {
                'Authorization':`Token ${localStorage.getItem('token')}`
            },data: {
                id: array[0]
            }}).then((res) =>  actions.setCourses(res.data) )
            //actions.setCoursesLectures(courses.lectures.filter((lectures) => lectures.id !== array[1]))
        }catch(err){
            console.log(`Error: ${err.message}`)
        }
    }),
    deleteLecture: thunk(async(actions, [...array], helpers) => {
        const { courses} = helpers.getState();
        try{
            await api.delete(`/courses/lecture/${array[1]}/`,{headers: {
                'Authorization':`Token ${localStorage.getItem('token')}`
            }, data: {
                id: array[0]
            }}).then((res) =>  actions.setCourses(res.data) )
            //actions.setCoursesLectures(courses.lectures.filter((lectures) => lectures.id !== array[1]))
        }catch(err){
            console.log(`Error: ${err.message}`)
        }
    }),
    deleteCourse: thunk(async (actions, id , helpers) => {
        const { courses } = helpers.getState();
        try{
            await api.delete(`/courses/delete/${id}/`,{
                headers: {
                'Authorization':`Token ${localStorage.getItem('token')}`
            }
            })
            actions.setCourses(courses.filter((course) => (course.id).toString() !== id))
        }catch(err){
            console.log(`Error: ${err.message}`)
        }
    }),
    editCourse: thunk(async (actions, updatedCourse, helpers) => {
        const { courses } = helpers.getState();
        const { id} = updatedCourse
        try{
            const response = await api.put(`/courses/edit/${id}/`,updatedCourse,{
            headers: {
                'Authorization':`Token ${localStorage.getItem('token')}`
            }});
            actions.setCourses(courses.map(course => course.id === id ? response.data : course));
            actions.setCourseName('')
            actions.setCoursesAssignments([])
            actions.setCoursesLectures([])
            actions.setCoursesProfiles([])
            actions.setCoursesTests([])
            actions.setCoursesThreads([])
        }catch(err){
            console.log(`Error: ${err.message}`)
        }
    }),

    editAssignment: thunk(async (actions, [...array], helpers) => {

        const {courses,canvasCourses, } = helpers.getState();
        //qqconst { assignments } = canvasCourses.findIndex(course => course.id === xtc[2]).assignments.findIndex(assignment => assignment.id === xtc[1])
        const formData = new FormData();
        formData.append("id", array[0].id)
        formData.append('file',array[0].file)
        formData.append("name",array[0].name)
        formData.append("date_due",array[0].date_due)
        formData.append("description",array[0].description)
        formData.append("max_points",array[0].max_points)
        formData.append("student_points",array[0].student_points)
        formData.append("submitter",array[0].submitter)
        
       try{
            const response = await api.post(`/courses/assignment/${array[1]}/`,formData,{headers: {
                'Authorization':`Token ${localStorage.getItem('token')}`,
                'Content-Type': 'multipart/form-data'
            }})
            
            actions.setCourses(courses.map(course => (course.id).toString() === array[1] ? {...response.data} : course))
            actions.setCanvasCourses(canvasCourses.map(course => (course.id).toString() === array[1] ? {...response.data} : course))
            actions.setAssignmentName('')
            actions.setAssignmentDate('')
            actions.setAssignmentDescription('')
            actions.setAssignmentMaxPoints('')
            actions.setAssignmentStudentPoints('')
            actions.setAssignmentSubmitter('')
            actions.setAssignmentFile('')
        }catch(err){
            console.log(`Error : ${err.message}`)
        }
    }),
    
    deleteAssignment: thunk(async (actions,[...array], helpers) => {
        
        const { courses, canvasCourses} = helpers.getState();
        try{
            const response = await api.delete(`/courses/assignment/${array[1]}/`,{
                headers: {
                'Authorization':`Token ${localStorage.getItem('token')}`
            },
                data: {
                id: array[0]}
            })
           actions.setCourses(courses.map(course => (course.id).toString() === array[1] ? {...response.data} : course))
           actions.setCanvasCourses(canvasCourses.map(course => (course.id).toString() === array[1] ? {...response.data} : course))
        }catch(err){
            console.log(`Error: ${err.message}`)
        }
    }),
    deleteMessage: thunk(async( actions, [...array], helpers) => {
        const { courses} = helpers.getState();
        try{
            await api.delete(`/threads/message/${array[1]}/`,{headers: {
                'Authorization':`Token ${localStorage.getItem('token')}`
            },data: {
                id: array[0]
            }}, {headers: {'Authorization':`Token ${localStorage.getItem('token')}` }}

            ).then((res) => {
                console.log(res.data)
            })
            actions.setCoursesThreads(courses.threads.filter((thread) => thread.thread_id !== array[1]))
        }catch(err){
            console.log(`Error: ${err.message}`)
        }
    }),
    deleteStudent: thunk(async(actions, [...array], helpers) => {
        const { courses} = helpers.getState();
        try{
            await api.delete(`/courses/student/${array[4]}/`,{headers: {
                'Authorization':`Token ${localStorage.getItem('token')}`
            },data:{
                email: array[0],
                first_name: array[1],
                last_name: array[2],
                date_of_birth: array[3]

            }}).then((res) => {
                console.log(res.data)
            })
            actions.setCoursesProfiles(courses.profiles.filter((profile) => profile.user.email !== array[0]))
        }catch(err){
            console.log(`Error: ${err.message}`)
        }
    })
})