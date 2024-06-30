import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import authService from './authService';

const PrivateRoute = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const checkToken = async () => {
            try {
                const response = await authService.check();
                setIsAuthenticated(!!response.user); 
            } catch (error) {
                setIsAuthenticated(false); 
                console.error("Error checking token:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        checkToken();
    }, []); 

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />; 
};

export default PrivateRoute;