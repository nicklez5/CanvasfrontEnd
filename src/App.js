import { Routes, Route, Outlet} from 'react-router-dom'
import Header from './components/Header';
import { useStoreActions, useStoreState } from 'easy-peasy';

import { useEffect } from 'react';

function App() {
  const fetchCourses = useStoreActions(actions => actions.courseStore.fetchCourses);
  
    useEffect(() => {
      fetchCourses()
  }, [fetchCourses]);


     return (

      <div className="App">
        <Header title="Canvas" />
        <Outlet />
      </div>
  );

}

export default App;
