import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import RecipeForm from './RecipeForm'; // Import the RecipeForm component
// import { Formik } from 'formik';
import * as Yup from 'yup';
import './UserProfile.css'

function UserProfile() {
  // States
  const [user, setUser] = useState(null);
  const [showRecipeForm, setShowRecipeForm] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [myRecipes, setMyRecipes] = useState([]);
  const [flavorToEdit, setFlavorToEdit] = useState(null);

  // Formik state
  const initialRecipeValues = {
    title: '',
    ingredients: '',
    instructions: '',
    image_url: '',
  };
  const recipeValidationSchema = Yup.object({
    title: Yup.string().required('Title is required'),
    ingredients: Yup.string().required('Ingredients are required'),
    instructions: Yup.string().required('Instructions are required'),
    image_url: Yup.string().url('Invalid image URL').required('Image URL is required'),
  });

  // Effects
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
      }
    };
    fetchUserData();
  }, []);

  // handleCreate recipe
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
      const response = await axios.put(`http://localhost:5555/recipes/${flavorToEdit.id}`, updatedRecipeData, { withCredentials: true });
      setMyRecipes(myRecipes.map(r => (r.id === flavorToEdit.id ? response.data : r)));
      setFlavorToEdit(null);
      setShowRecipeForm(false);
    } catch (error) {
      console.error('Error updating recipe:', error);
      // Handle error display
    }
  };

  // handleDelete recipe
  const handleDeleteRecipe = async (id) => {
    try {
      await axios.delete(`http://localhost:5555/recipes/${id}`, { withCredentials: true });
      setMyRecipes(myRecipes.filter(recipe => recipe.id !== id));
      setFavorites(favorites.filter(fav => fav.recipe_id !== id));
      setFlavorToEdit(null); // added to clear flavorToEdit state after deleting
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  // Function to render recipes (for both "My Recipes" and "Favorite Recipes")
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
                  <Button as={Link} to={`/recipes/${recipe.id}`} variant="primary">View</Button>
                  {/* Only show Edit and Delete buttons for "My Recipes" */}
                  {sectionTitle === 'My Recipes' && (
                    <div>
                      <Button variant="warning" onClick={() => { setFlavorToEdit(recipe); setShowRecipeForm(true); }}>Edit</Button>
                      <Button variant="danger" onClick={() => handleDeleteRecipe(recipe.id)}>Delete</Button>
                    </div>
                  )}
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
      <img src={"https://cleangreensimple.com/wp-content/uploads/2020/12/cutting-board.jpg"} alt="FlavorFinder Profile Page" className="user-main-img" />
      <h1 className="profile-title">My Profile</h1>
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
          {renderRecipes(favorites, "Favorite Recipes")}
          {renderRecipes(myRecipes, "My Recipes")}

          {/* Recipe Form Modal */}
          {showRecipeForm && (
            <RecipeForm
              initialValues={flavorToEdit || initialRecipeValues}
              validationSchema={recipeValidationSchema}
              onSubmit={(values) => {
                if (flavorToEdit) {
                  handleUpdateRecipe({ ...values, id: flavorToEdit.id });
                } else {
                  handleCreateRecipe(values);
                }
              }}
              onHide={() => setShowRecipeForm(false)}
            />
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default UserProfile;