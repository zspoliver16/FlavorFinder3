import React from 'react';
import { Navbar as BootstrapNavbar, Container, Nav, Button } from 'react-bootstrap';
import { Link,  NavLink, useNavigate } from 'react-router-dom';
import authService from './authService';  
import "./NavBar.css"

function NavBar() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authService.logout(); // Assuming you have a logout function in your authService
            localStorage.removeItem('token'); // or localStorage.removeItem('user');
            navigate('/'); // Redirect to the landing page or login page
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <BootstrapNavbar>
            <Container className="navbar">
                <BootstrapNavbar.Brand as={Link} to="/">FlavorFinder</BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/home">Home</Nav.Link>
                        <Nav.Link as={NavLink} to="/recipes">Recipes</Nav.Link>
                        <Nav.Link as={NavLink} to="/favorites">Favorites</Nav.Link>
                    </Nav>
                    <Button variant="outline-primary" onClick={handleLogout}>Logout</Button>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
}

export default NavBar;