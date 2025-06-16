import 'bootstrap/dist/css/bootstrap.min.css';  // ← if you’re using React-Bootstrap
import './index.css'; 
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStoreRehydrated } from 'easy-peasy';
import store from './interface/model';
import App       from './App';
import Header from './components/Header';
import Courses from './components/_Courses/Courses';
import CoursePage from './components/_Courses/CoursePage';
import EditCourse from './components/_Courses/EditCourse';
import NewCourse from './components/_Courses/NewCourse';
import LoginPage from './components/_UI/LoginPage';
import Home from './components/_UI/Home';
import UserCourses from './components/_UI/UserCourses';
import EditAssignment from './components/_Assignments/EditAssignment';
import NewAssignment from './components/_Assignments/NewAssignment';
import NewLecture from './components/_Lectures/NewLecture';
import Register from './components/_UI/Register';
import ProfilePage from './components/_Profiles/ProfilePage';
import NewTest from './components/_Tests/NewTest';
import NewThread from './components/_Threads/NewThread';
import NewMessage from './components/_Threads/NewMessage';
import ForgotPassword from './components/_UI/ForgotPassword';
import EditMessage from './components/_Threads/EditMessage';
import EditLecture from './components/_Lectures/EditLecture';
import SubmitAssignment from './components/_Assignments/SubmitAssignment';
import GradeAssignment from './components/_Assignments/GradeAssignment';
import { fetchCsrfCookie } from "./utils/setupCsrf";
import UserSettings from './components/_UI/UserSettings';
import SubmitTest from './components/_Tests/SubmitTest';
import StaffTestSubmissions from './components/_Tests/StaffTestSubmissions';
import StaffAssignmentSubmissions from './components/_Assignments/StaffAssignmentSubmissions';
import ViewGrades from './components/_UI/ViewGrades';
import EditThread from './components/_Threads/EditThread';
import EditTest from './components/_Tests/EditTest';
// … import all your pages …

const AppWrapper = () => {
  const rehydrated = useStoreRehydrated();
  if (!rehydrated) return <div>Loading…</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
        {/* Wrap all pages in App so Header, fetchCourses, etc., stay */}
         <Route index element={<LoginPage />} />
          <Route path="home" element={<Home />} />
          <Route path="courses" element={<Courses />} />
           <Route path="UserCourses" element={<UserCourses />} />
          <Route  path="postCourse" element={<NewCourse />} />
          <Route path="addAssignment/:courseID" element={<NewAssignment />} />
          <Route path="editCourse/:id" element={<EditCourse />}/>
          <Route  path="courses/:id"  element={<CoursePage  />}/>
          <Route path="editCourse/:id/Assignment/:id2" element = {<EditAssignment/>}/>
          <Route  path="addLecture/:courseID" element={<NewLecture />} />
          <Route  path="addTest/:courseID" element={<NewTest/>}/>
          <Route  path="register" element={<Register/>}/>
          <Route path="forgotPassword" element={<ForgotPassword/>}/>
          <Route path="Profile" element ={<ProfilePage/>}/>
          <Route path="addThread/:id"  element={<NewThread />} />
          <Route path="addMessage/:threadID/:courseID" element={<NewMessage />} />
          <Route path="editMessage/:courseID/:threadID/:messageID" element={<EditMessage/>}/>
          <Route path="editTest/:testID/:courseID" element={<EditTest/>}/>
          <Route path="editThread/:courseID/:threadID" element={<EditThread/>}/>
          <Route path="editLecture/:courseID/:lectureID" element={<EditLecture/>}/>
          <Route path="editAssignment/:assignmentID/:courseID" element={<EditAssignment/>}/>
          <Route path="submitAssignment/:courseID/:assignmentID" element={<SubmitAssignment/>}/>
          <Route path="submitTest/:courseID/:testID" element={<SubmitTest/>}/>
          <Route path="gradeAssignment/:courseID/:assignmentID" element={<GradeAssignment/>}/>
          <Route path="staff/tests/:testId/submissions" element={<StaffTestSubmissions/>}/>
          <Route path="staff/assignments/:assignmentId/submissions" element={<StaffAssignmentSubmissions/>}/>
          <Route path="courses/:courseID/grades" element={<ViewGrades/>}/>
          <Route path="UserSettings" element={<UserSettings/>}/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

fetchCsrfCookie().then(() => {ReactDOM.createRoot(document.getElementById('root')).render(
  <StoreProvider store={store}>
    <AppWrapper />
  </StoreProvider>)
});