import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import RecipeForm from './RecipeForm'; 
import axios from 'axios';

function UserProfile() {
    const [user, setUser] = useState(null);
    const [showRecipeForm, setShowRecipeForm] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [myRecipes, setMyRecipes] = useState([]);

    useEffect(() => {
        // Fetch user data (including recipes and favorites)
        const fetchUserData = async () => {
            try {
                const response = await axios.get('http://localhost:5555/user/profile', { withCredentials: true }); 
                setUser(response.data.user);
                setMyRecipes(response.data.recipes); 
                setFavorites(response.data.favorites); 
            } catch (error) {
                console.error("Error fetching user data:", error);
                // Handle error appropriately
            }
        };
        fetchUserData();
    }, []);
    // handleCreate recipe (same as HomePage.jsx)
    const handleCreateRecipe = async (newRecipeData) => {
      try {
        const response = await axios.post('http://localhost:5555/recipes', newRecipeData, { withCredentials: true });
        setMyRecipes([response.data, ...myRecipes]);
        setShowRecipeForm(false); 
      } catch (error) {
        console.error('Error creating recipe:', error);
        // Handle error display 
      }
  };

    // handleUpdate recipe
    const handleUpdateRecipe = async (updatedRecipeData) => {
      try {
        const response = await axios.put(`http://localhost:5555/recipes/${updatedRecipeData.id}`, updatedRecipeData, { withCredentials: true });
        setMyRecipes(myRecipes.map(r => r.id === updatedRecipeData.id ? response.data : r));
        setShowRecipeForm(false);
      } catch (error) {
        console.error('Error updating recipe:', error);
      }
    };

    // handleDelete recipe
    const handleDeleteRecipe = async (id) => {
      try {
        await axios.delete(`http://localhost:5555/recipes/${id}`, { withCredentials: true });
        setMyRecipes(myRecipes.filter(recipe => recipe.id !== id));
      } catch (error) {
        console.error('Error deleting recipe:', error);
      }
    };

    const renderRecipes = (recipesArray, sectionTitle) => (
        <>
            <h2>{sectionTitle}</h2>
            <Row xs={1} md={2} className="g-4">
                {recipesArray.map(recipe => (
                    <Col key={recipe.id}> 
                        <Card>
                            <Card.Img variant="top" src={recipe.image_url} />
                            <Card.Body>
                                <Card.Title>{recipe.name}</Card.Title>
                                <Card.Text>{recipe.description}</Card.Text>
                                <div className="d-flex justify-content-between align-items-center">
                                    <Button as={Link} to={`/recipe/${recipe.id}`} variant="primary">View</Button>
                                    <div>
                                        <Button variant="warning" onClick={() => { setFlavorToEdit(recipe); setShowRecipeForm(true); }}>Edit</Button>
                                        <Button variant="danger" onClick={() => handleDeleteRecipe(recipe.id)}>Delete</Button>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </>
    );

    return (
        <Container>
            <h1>My Profile</h1>
            <Row>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>{user?.username}</Card.Title>
                            {/* Add more user details (e.g., email, profile picture) */}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={8}>
                    {renderRecipes(favorites, 'Favorite Recipes')}
                    {renderRecipes(myRecipes, 'My Recipes')}
                    {showRecipeForm && <RecipeForm 
                        flavorToEdit={flavorToEdit} 
                        onCreate={handleCreateRecipe} 
                        onUpdate={handleUpdateRecipe}
                        onClose={() => setShowRecipeForm(false)} 
                    />}
                </Col>
            </Row>
        </Container>
    );
}

export default UserProfile;