import axios from 'axios';

const BASE_URL = 'http://localhost:5555'; 

// Configure Axios to include credentials (cookies) in requests
axios.defaults.withCredentials = true; 

const authService = {
  login: async (credentials) => {
    const response = await axios.post(`${BASE_URL}/login`, credentials);
    localStorage.setItem('token', response.data.token);
    return response.data; 
  },

  signup: async (userData) => {
    const response = await axios.post(`${BASE_URL}/signup`, userData);
    localStorage.setItem('token', response.data.token); 
    return response.data;
  },

  check: async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BASE_URL}/check_session`, {
        headers: { Authorization: `Bearer ${token}` } 
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        if (typeof window !== 'undefined' && window.location) {
            window.location.href = "/login";
        }
      }
      throw error; 
    } 
  }, 

  logout: async () => {
    try {
        await axios.delete(`${BASE_URL}/logout`, { withCredentials: true }); // Send DELETE request to logout
        localStorage.removeItem('token'); 
    } catch (error) {
        console.error("Error logging out:", error);
        throw error; // Re-throw for handling in the component
    }
} 
};

export default authService;