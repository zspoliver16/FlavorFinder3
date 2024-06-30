import React, { useState } from 'react';
import authService from './authService';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'

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
          console.log('Login response:', response); 
          if(response.user) {
              localStorage.setItem('user', JSON.stringify(response.user));
          }
          
          // Redirect to home page after successful login
          setTimeout(() => {
              setIsLoading(false);
              navigate('/home'); // Now navigate after the delay
          }, 500); 
  
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
        <div className="username">
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
        <div className="password">
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