import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { StoreProvider, useStoreRehydrated } from 'easy-peasy';
import store from '../src/interface/model';
const AppWrapper = () => {
  const rehydrated = useStoreRehydrated();  // Check if the store has been rehydrated from localStorage

  useEffect(() => {
    if (rehydrated) {
      console.log('Store has been rehydrated from localStorage');
    }
  }, [rehydrated]);

  if (!rehydrated) {
    // Optionally show a loading spinner or message until the state is rehydrated
    return <div>Loading...</div>;
  }
  return (
    <Router>
      <Routes>
        <Route path='/*' element={<App />} />
      </Routes>
    </Router>
  );
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <StoreProvider store = {store}>
        <AppWrapper />
    </StoreProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

