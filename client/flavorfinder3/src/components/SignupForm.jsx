import React, { useState } from 'react';
import authService from './authService';
import { useNavigate } from 'react-router-dom';

function SignupForm() {
    const [formData, setFromData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFromData({ ...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await authService.signup(formData);
            console.log(response.data.msg);
            localStorage.setItem('token', response.data.access_token);
            navigate('/login');
          } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred during signup.');
          }
    };

    return (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit">Sign Up</button>
        </form>
      );
}

export default SignupForm;