import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes } from 'react-router-dom';

import './App.css'
import Login from './components/auth/login/login';
import Register from './components/auth/register/register';
import Dashboard from './components/dashboard/dashboard';

function App() {
	// Check if a user token exists in local storage
  const isUserAuthenticated = () => {
    const userToken = localStorage.getItem('userToken');
    return !!userToken; // Return true if token exists, false otherwise
  };

  const [isLoggedIn, setLoggedIn] = useState(isUserAuthenticated);
	const handleOnLogIn = () => {
		setLoggedIn(isUserAuthenticated);
	}

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login onLogin={handleOnLogIn}/>}
        />
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Register onRegister={handleOnLogIn}/>}
        />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard onLogOut={handleOnLogIn} /> : <Navigate to="/login" />}
        />
        <Route path="/" element={isLoggedIn ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
