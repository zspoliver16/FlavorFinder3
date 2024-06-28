import React, { useState } from 'react';
import authService from './authService';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setError(null);
      setIsLoading(true);
  
      try {
        const response = await authService.login(formData);
        console.log('Login response:', response); // Log the entire response
  
        // Store token ONLY if the response contains it
        if (response.token) { 
          localStorage.setItem('token', response.token);
          setTimeout(() => {
            setIsLoading(false);
            navigate('/');
          }, 500); 
        } else {
          // Handle case where the backend doesn't return a token
          setError('Login failed. Please check your credentials.');
          setIsLoading(false);
        }
  
      } catch (error) {
        setIsLoading(false);
        console.error('Login error:', error);
  
        if (error.response && error.response.data) {
          setError(error.response.data.error || 'Login failed. Please try again.'); 
        } else {
          setError('An unknown error occurred. Please try again later.');
        }
      }
    };

    return (
        <form onSubmit={handleSubmit}>
        <h2>Login</h2>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="error">{error}</div>} {/* Display error message */}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    );
}

export default LoginForm;