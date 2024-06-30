import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';

function HomePage() {
    const [flavors, setFlavors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFlavors = async () => {
            try {
                const response = await axios.get('http://localhost:5555/flavors', {
                    withCredentials: true  
                });
                setFlavors(response.data);
            } catch (error) {
                console.error('Error fetching flavors:', error);
                // Handle errors appropriately (e.g., display an error message to the user)
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchFlavors(); 
    }, []); 

    const renderFeaturedFlavors = () => {
        if (isLoading) {
            return <p>Loading flavors...</p>; 
        }

        if (!flavors || flavors.length === 0) {
            return <p>No flavors found.</p>;
        }

        return (
            <Row xs={1} md={3} className="g-4"> 
                {flavors.map((flavor) => (
                    <Col key={flavor.id}>
                        <Card>
                            {/* Display image if available */}
                            {flavor.image_url && <Card.Img variant="top" src={flavor.image_url} />} 
                            <Card.Body>
                                <Card.Title>{flavor.name}</Card.Title>
                                <Card.Text>{flavor.description}</Card.Text>
                                <Button as={Link} to={`/flavors/${flavor.id}`} variant="primary">Explore</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        );
    };

    return (
        <Container>
            {/* Add a user greeting or other content here */}
            <h1>Welcome to FlavorFinder!</h1> 
            <section className="featured-flavors mt-4">
                <h2>Featured Flavors</h2>
                {renderFeaturedFlavors()}
            </section>
        </Container>
    );
}

export default HomePage;