import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';
import PrivateRoute from './components/PrivateRoute';
import HomePage from './components/HomePage';
import LandingPage from './components/LandingPage';
import RecipesPage from './components/RecipesPage';
import UserProfile from './components/UserProfile';
import RecipeForm from './components/RecipeForm';
import NavBar from './components/NavBar';
import './App.css'



function App() {
    return (
        <Router>
            <NavBar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/login" element={<LoginForm />} />
        
            {/* The route does not need to be nested under /home now. */}
            <Route path="/recipes" element={<RecipesPage />} /> 
            <Route element={<PrivateRoute />}>
                <Route path="/home" element={<HomePage />} /> 
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/new-recipe" element={<RecipeForm />} />
            </Route>
            {/* <Route path="*" element={<Navigate to="/" />} /> */}
          </Routes>
        </Router>
    );
}

export default App;