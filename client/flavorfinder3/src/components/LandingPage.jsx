import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import "./LandingPage.css"

function LandingPage() {
    return (
        <Container className="landing-cont">
            <img src={"https://www.westside.social/wp-content/uploads/2017/12/food-background-food-concept-with-various-tasty-fresh-ingredients-for-cooking-italian-food-ingredients-view-from-above-with-copy-space_1220-1491-2-e1513108150131.jpg"} alt="FlavorFinder Landing Page" className="landing-img" />
            <h1>Welcome to FlavorFinder</h1>
            <p>Discover your next favorite flavors!</p>
            <Button as={Link} to="/login" variant="primary" className="land-log">Login</Button>
            <Button as={Link} to="/signup" variant="secondary" className="land-sign">Sign Up</Button>
        </Container>
    );
}

export default LandingPage;