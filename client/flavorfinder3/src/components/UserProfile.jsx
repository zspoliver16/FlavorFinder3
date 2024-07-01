import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import RecipeForm from './RecipeForm'; // Assuming you'll create this later

function UserProfile() {
    const [user, setUser] = useState(null); // State to store user data
    const [showRecipeForm, setShowRecipeForm] = useState(false);

    useEffect(() => {
        // Fetch user data (including recipes) from your backend here
        // Example:
        const userData = {
            username: 'testuser',
            recipes: [
                { title: 'Recipe 1', ingredients: ['Ingredient A', 'Ingredient B'] },
                // ... more recipes
            ]
        };
        setUser(userData);
    }, []); // Empty dependency array ensures this runs only once

    const handleAddRecipe = () => {
        setShowRecipeForm(true);
    };

    return (
        <Container>
            <h1>My Profile</h1>
            <Row>
                <Col md={4}>
                    {/* User Info Card */}
                    <Card>
                        <Card.Body>
                            <Card.Title>{user?.username}</Card.Title>
                            {/* Add more user details (e.g., email, profile picture) */}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    {/* My Recipes Section */}
                    <h2>My Recipes</h2>
                    <Button onClick={handleAddRecipe}>Add Recipe</Button>
                    {showRecipeForm && <RecipeForm />}
                    <Row xs={1} md={2} className="g-4">
                        {user?.recipes.map((recipe) => (
                            <Col key={recipe.title}>
                                {/* RecipeCard Component */}
                                <Card>
                                    <Card.Body>
                                        <Card.Title>{recipe.title}</Card.Title>
                                        <Card.Text>{recipe.ingredients.join(', ')}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}

export default UserProfile;