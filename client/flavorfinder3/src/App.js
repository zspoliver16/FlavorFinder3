import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './components/HomePage';
import LandingPage from './components/LandingPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/home" element={<HomePage />} />
                    {/* ...other protected routes... */}
                </Route>
            </Routes>
        </Router>
    );
}

export default App;