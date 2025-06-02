import 'bootstrap/dist/css/bootstrap.min.css';  // ← if you’re using React-Bootstrap
import './index.css'; 
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider, useStoreRehydrated } from 'easy-peasy';
import store from './interface/model';
import App       from './App';
import Header from './components/Header';
import Courses from './components/Courses';
import CoursePage from './components/CoursePage';
import EditCourse from './components/EditCourse';
import NewCourse from './components/NewCourse';
import LoginPage from './components/LoginPage';
import Home from './components/Home';
import UserCourses from './components/UserCourses';
import EditAssignment from './components/EditAssignment';
import NewAssignment from './components/NewAssignment';
import NewLecture from './components/NewLecture';
import Register from './components/Register';
import ProfilePage from './components/ProfilePage';
import NewTest from './components/NewTest';
import NewThread from './components/NewThread';
import NewMessage from './components/NewMessage';
import ForgotPassword from './components/ForgotPassword';
import EditMessage from './components/EditMessage';
import EditLecture from './components/EditLecture';
import SubmitAssignment from './components/SubmitAssignment';
import GradeAssignment from './components/GradeAssignment';
import { fetchCsrfCookie } from "./utils/setupCsrf";
import UserSettings from './components/UserSettings';
import SubmitTest from './components/SubmitTest';
import StaffTestSubmissions from './components/StaffTestSubmissions';
import StaffAssignmentSubmissions from './components/StaffAssignmentSubmissions';
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
          <Route path="editLecture/:courseID/:lectureID" element={<EditLecture/>}/>
          <Route path="editAssignment/:assignmentID/:courseID" element={<EditAssignment/>}/>
          <Route path="submitAssignment/:courseID/:assignmentID" element={<SubmitAssignment/>}/>
          <Route path="submitTest/:courseID/:testID" element={<SubmitTest/>}/>
          <Route path="gradeAssignment/:courseID/:assignmentID" element={<GradeAssignment/>}/>
          <Route path="staff/tests/:testId/submissions" element={<StaffTestSubmissions/>}/>
          <Route path="staff/assignments/:assignmentId/submissions" element={<StaffAssignmentSubmissions/>}/>
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