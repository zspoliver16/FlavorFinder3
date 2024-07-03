import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginForm.css';

function Login() {
    const [username, setUsername] = useState('');  // Use username instead of email
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
  
    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://127.0.0.1:5555/login', { username, password }); // Updated data
        if (response.status === 200) {
          setMessage('Login successful');
          localStorage.setItem('token', response.data.token);
          setTimeout(() => {
            navigate('/home');
          }, 2000); 
        } else {
          setMessage('Login failed');
        }
      } catch (error) {
        setMessage(`Login failed: ${error.response?.data?.error || error.message}`); // Updated error message
      }
    };
  
    return (
      <div className='loginPage'>
        <div className='initLoginContainer'>
          <h2>Login</h2>
          <form className='loginForm' onSubmit={handleLogin}>
            <input type="text" onChange={(e) => setUsername(e.target.value)} className="form-control-login" placeholder="Username" required /> 
            <input type="password" onChange={(e) => setPassword(e.target.value)} className="form-control-login" placeholder="Password" required />
            <button type="submit" className="btn btn-primary mt-2">Login</button>
            <p>{message}</p>
          </form>
        </div>
      </div>
    );
  }
  
  export default Login;