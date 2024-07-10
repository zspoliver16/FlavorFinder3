import React from 'react';
import { Navbar as BootstrapNavbar, Container, Nav, Button, Image } from 'react-bootstrap';
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
        <BootstrapNavbar className="navbar">
            <Container className="navbar">
                <BootstrapNavbar.Brand as={Link} to="/">FlavorFinder</BootstrapNavbar.Brand>
                <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
                <BootstrapNavbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/home">
                            <Image src="https://i.pinimg.com/originals/08/a3/fb/08a3fb6020a9bd999c30d383e79c256f.jpg" alt="Home Icon" className="nav-icon" thumbnail /> Home
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/recipes">
                            <Image src="https://clipground.com/images/cookbook-images-clip-art-13.jpg" alt="Recipes Icon" className="nav-icon"  thumbnail /> Recipes
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/new-recipe">
                            <Image src="https://img.freepik.com/free-photo/person-writing-recipe-notebook_23-2148173188.jpg?size=626&ext=jpg" alt="Add Recipe Icon" className="nav-icon"  thumbnail /> Add New Recipe
                        </Nav.Link>
                    </Nav>
                    <Button variant="outline-primary" onClick={handleLogout}>Logout</Button>
                </BootstrapNavbar.Collapse>
            </Container>
        </BootstrapNavbar>
    );
}

export default NavBar;