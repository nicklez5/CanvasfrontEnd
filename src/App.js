import { Routes, Route} from 'react-router-dom'
import Header from './components/Header';
import Courses from './components/Courses';
import { useStoreActions, useStoreState } from 'easy-peasy';
import useAxiosFetch from './hooks/useAxiosFetch';
import { useEffect } from 'react';
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
function App() {
  const fetchCourses = useStoreActions(actions => actions.courseStore.fetchCourses);
  const { loading, error } = useStoreState((state) => state.courseStore)
    useEffect(() => {
      fetchCourses()
  }, [fetchCourses]);

  return (
    
    <div className="App">
      <Header title="Canvas"/>
      <Routes>
        <Route exact path="/" element = {<LoginPage/>  }/>
        <Route exact path="/home" element= {<Home/>} />
        <Route exact path="/Courses" element = {
            <Courses
              isLoading={loading}
              fetchError={error}
              />} />
          <Route exact path="/UserCourses" element = {
            <UserCourses
            isLoading={loading}
            fetchError={error}
            />} />
            
        <Route exact path="/postCourse" element={<NewCourse />} />
        <Route exact path="/addAssignment/:courseID" element={<NewAssignment />} />
        <Route  path="/editCourse/:id" element={<EditCourse />}/>
        <Route exact path="/courses/:id"  element={<CoursePage  />}/>
        <Route path="/editCourse/:id/Assignment/:id2" element = {<EditAssignment/>}/>
        <Route exact path="/addLecture/:courseID" element={<NewLecture />} />
        <Route exact path="/addTest/:courseID" element={<NewTest/>}/>
        <Route exact path="/register" element={<Register/>}/>
        <Route exact path="/Profile" element ={<ProfilePage/>}/>
        <Route exact path="/addThread/:courseID" element={<NewThread/>}/>
      </Routes>
    </div>
  );
}

export default App;
